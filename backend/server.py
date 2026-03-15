from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Request, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
from jose import jwt, JWTError
import csv
import io
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import asyncio
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT & Stripe Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'ugabuy_secret_key_2026')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

resend.api_key = RESEND_API_KEY

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

logger = logging.getLogger(__name__)

# ===== MODELS =====

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    phone: Optional[str] = None
    name: str
    password_hash: str
    addresses: List[Dict[str, str]] = Field(default_factory=list)
    is_admin: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserRegister(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    category: str
    price: float
    condition: str
    specifications: Dict[str, Any] = Field(default_factory=dict)
    images: List[str] = Field(default_factory=list)
    stock: int = 0
    description: str = ""
    featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProductCreate(BaseModel):
    name: str
    brand: str
    category: str
    price: float
    condition: str
    specifications: Dict[str, Any] = Field(default_factory=dict)
    images: List[str] = Field(default_factory=list)
    stock: int = 0
    description: str = ""
    featured: bool = False

class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    review_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    user_id: str
    user_name: str
    rating: int
    comment: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    comment: str

class CartItem(BaseModel):
    product_id: str
    quantity: int

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    cart_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[CartItem] = Field(default_factory=list)
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[Dict[str, Any]] = Field(default_factory=list)
    total_amount: float
    payment_method: str
    payment_status: str = "pending"
    order_status: str = "pending"
    shipping_address: Dict[str, str] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class OrderCreate(BaseModel):
    items: List[CartItem]
    shipping_address: Dict[str, str]
    payment_method: str

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_id: str
    session_id: Optional[str] = None
    amount: float
    currency: str = "ugx"
    payment_status: str = "initiated"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Promotion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    promotion_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    discount_percentage: float
    active: bool = True
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ===== HELPER FUNCTIONS =====

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str, email: str, is_admin: bool = False) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "is_admin": is_admin,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_admin_user(user: dict = Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def send_email_async(recipient: str, subject: str, html_content: str):
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [recipient],
            "subject": subject,
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# ===== AUTH ENDPOINTS =====

@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        phone=user_data.phone,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    await db.users.insert_one(user.model_dump())
    
    token = create_jwt_token(user.user_id, user.email, user.is_admin)
    return {"token": token, "user": {"user_id": user.user_id, "name": user.name, "email": user.email, "is_admin": user.is_admin}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_jwt_token(user["user_id"], user["email"], user.get("is_admin", False))
    return {"token": token, "user": {"user_id": user["user_id"], "name": user["name"], "email": user["email"], "is_admin": user.get("is_admin", False)}}

@api_router.get("/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    user_data = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0, "password_hash": 0})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

# ===== PRODUCT ENDPOINTS =====

@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, brand: Optional[str] = None, 
                      condition: Optional[str] = None, min_price: Optional[float] = None,
                      max_price: Optional[float] = None, search: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    if brand:
        query["brand"] = brand
    if condition:
        query["condition"] = condition
    if min_price or max_price:
        query["price"] = {}
        if min_price:
            query["price"]["$gte"] = min_price
        if max_price:
            query["price"]["$lte"] = max_price
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/featured", response_model=List[Product])
async def get_featured_products():
    products = await db.products.find({"featured": True}, {"_id": 0}).to_list(20)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return {"categories": categories}

@api_router.get("/brands")
async def get_brands():
    brands = await db.products.distinct("brand")
    return {"brands": brands}

# ===== REVIEW ENDPOINTS =====

@api_router.get("/reviews/{product_id}", response_model=List[Review])
async def get_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).to_list(1000)
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, user: dict = Depends(get_current_user)):
    user_info = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
    review = Review(
        product_id=review_data.product_id,
        user_id=user["user_id"],
        user_name=user_info["name"],
        rating=review_data.rating,
        comment=review_data.comment
    )
    await db.reviews.insert_one(review.model_dump())
    return review

# ===== CART ENDPOINTS =====

@api_router.get("/cart")
async def get_cart(user: dict = Depends(get_current_user)):
    cart = await db.cart.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not cart:
        return {"cart_id": str(uuid.uuid4()), "user_id": user["user_id"], "items": []}
    
    # Populate product details
    items_with_details = []
    for item in cart.get("items", []):
        product = await db.products.find_one({"product_id": item["product_id"]}, {"_id": 0})
        if product:
            items_with_details.append({
                "product": product,
                "quantity": item["quantity"]
            })
    
    return {"cart_id": cart["cart_id"], "user_id": cart["user_id"], "items": items_with_details}

@api_router.post("/cart/add")
async def add_to_cart(item: CartItem, user: dict = Depends(get_current_user)):
    cart = await db.cart.find_one({"user_id": user["user_id"]}, {"_id": 0})
    
    if not cart:
        cart = Cart(user_id=user["user_id"], items=[item])
        await db.cart.insert_one(cart.model_dump())
    else:
        items = cart.get("items", [])
        found = False
        for existing_item in items:
            if existing_item["product_id"] == item.product_id:
                existing_item["quantity"] += item.quantity
                found = True
                break
        
        if not found:
            items.append(item.model_dump())
        
        await db.cart.update_one(
            {"user_id": user["user_id"]},
            {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    
    return {"message": "Item added to cart"}

@api_router.put("/cart/update")
async def update_cart(item: CartItem, user: dict = Depends(get_current_user)):
    cart = await db.cart.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = cart.get("items", [])
    for existing_item in items:
        if existing_item["product_id"] == item.product_id:
            existing_item["quantity"] = item.quantity
            break
    
    await db.cart.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Cart updated"}

@api_router.delete("/cart/remove/{product_id}")
async def remove_from_cart(product_id: str, user: dict = Depends(get_current_user)):
    cart = await db.cart.find_one({"user_id": user["user_id"]}, {"_id": 0})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = [item for item in cart.get("items", []) if item["product_id"] != product_id]
    
    await db.cart.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"items": items, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"message": "Item removed from cart"}

# ===== ORDER ENDPOINTS =====

@api_router.post("/orders/create")
async def create_order(order_data: OrderCreate, user: dict = Depends(get_current_user)):
    # Calculate total
    total = 0.0
    order_items = []
    
    for item in order_data.items:
        product = await db.products.find_one({"product_id": item.product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product['name']}")
        
        total += product["price"] * item.quantity
        order_items.append({
            "product_id": product["product_id"],
            "name": product["name"],
            "price": product["price"],
            "quantity": item.quantity
        })
    
    order = Order(
        user_id=user["user_id"],
        items=order_items,
        total_amount=total,
        payment_method=order_data.payment_method,
        shipping_address=order_data.shipping_address
    )
    
    await db.orders.insert_one(order.model_dump())
    
    # Clear cart
    await db.cart.delete_one({"user_id": user["user_id"]})
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(user: dict = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({"order_id": order_id, "user_id": user["user_id"]}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# ===== PAYMENT ENDPOINTS =====

@api_router.post("/payments/checkout")
async def create_checkout(request: Request, user: dict = Depends(get_current_user)):
    body = await request.json()
    order_id = body.get("order_id")
    origin_url = body.get("origin_url")
    
    if not order_id or not origin_url:
        raise HTTPException(status_code=400, detail="order_id and origin_url required")
    
    order = await db.orders.find_one({"order_id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Convert UGX to USD for Stripe (1 USD = ~3800 UGX approx)
    amount_usd = round(order["total_amount"] / 3800.0, 2)
    
    # Initialize Stripe
    host_url = origin_url
    webhook_url = f"{os.environ.get('REACT_APP_BACKEND_URL', host_url)}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{origin_url}/orders/{order_id}?session_id={{{{CHECKOUT_SESSION_ID}}}}"
    cancel_url = f"{origin_url}/checkout"
    
    checkout_request = CheckoutSessionRequest(
        amount=amount_usd,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={"order_id": order_id, "user_id": user["user_id"]}
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction
    transaction = PaymentTransaction(
        order_id=order_id,
        session_id=session.session_id,
        amount=order["total_amount"],
        currency="ugx",
        payment_status="initiated"
    )
    await db.payment_transactions.insert_one(transaction.model_dump())
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, user: dict = Depends(get_current_user)):
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Check if already processed
    if transaction["payment_status"] == "paid":
        return {"status": "complete", "payment_status": "paid"}
    
    # Poll Stripe for status
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction and order
    if status.payment_status == "paid" and transaction["payment_status"] != "paid":
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": "paid", "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        await db.orders.update_one(
            {"order_id": transaction["order_id"]},
            {"$set": {"payment_status": "paid", "order_status": "processing", "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        # Update stock
        order = await db.orders.find_one({"order_id": transaction["order_id"]}, {"_id": 0})
        for item in order["items"]:
            await db.products.update_one(
                {"product_id": item["product_id"]},
                {"$inc": {"stock": -item["quantity"]}}
            )
        
        # Send confirmation email
        user_info = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0})
        email_html = f"""
        <h1>Order Confirmed!</h1>
        <p>Hi {user_info['name']},</p>
        <p>Your order #{transaction['order_id'][:8]} has been confirmed.</p>
        <p>Total: UGX {transaction['amount']:,.0f}</p>
        <p>Thank you for shopping with UgaBuy!</p>
        """
        await send_email_async(user_info["email"], "Order Confirmation - UgaBuy", email_html)
    
    return {"status": status.status, "payment_status": status.payment_status}

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body_bytes = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    try:
        webhook_response = await stripe_checkout.handle_webhook(body_bytes, signature)
        logger.info(f"Webhook event: {webhook_response.event_type}")
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ===== ADMIN ENDPOINTS =====

@api_router.post("/admin/products", response_model=Product)
async def admin_create_product(product_data: ProductCreate, user: dict = Depends(get_admin_user)):
    product = Product(**product_data.model_dump())
    await db.products.insert_one(product.model_dump())
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def admin_update_product(product_id: str, product_data: ProductCreate, user: dict = Depends(get_admin_user)):
    result = await db.products.update_one(
        {"product_id": product_id},
        {"$set": product_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    return product

@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, user: dict = Depends(get_admin_user)):
    result = await db.products.delete_one({"product_id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

@api_router.post("/admin/products/bulk-import")
async def bulk_import_products(file: UploadFile = File(...), user: dict = Depends(get_admin_user)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    
    contents = await file.read()
    csv_data = io.StringIO(contents.decode('utf-8'))
    reader = csv.DictReader(csv_data)
    
    products = []
    for row in reader:
        product = Product(
            name=row.get('name', ''),
            brand=row.get('brand', ''),
            category=row.get('category', ''),
            price=float(row.get('price', 0)),
            condition=row.get('condition', 'new'),
            specifications={
                'ram': row.get('ram', ''),
                'storage': row.get('storage', ''),
                'processor': row.get('processor', ''),
                'screen_size': row.get('screen_size', ''),
                'battery': row.get('battery', ''),
                'camera': row.get('camera', ''),
                'os': row.get('os', '')
            },
            images=row.get('image_url', '').split(',') if row.get('image_url') else [],
            stock=int(row.get('stock', 0)),
            description=row.get('description', ''),
            featured=row.get('featured', '').lower() == 'true'
        )
        products.append(product.model_dump())
    
    if products:
        await db.products.insert_many(products)
    
    return {"message": f"{len(products)} products imported successfully"}

@api_router.get("/admin/orders", response_model=List[Order])
async def admin_get_orders(user: dict = Depends(get_admin_user)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders

@api_router.put("/admin/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, status: str = Form(...), user: dict = Depends(get_admin_user)):
    result = await db.orders.update_one(
        {"order_id": order_id},
        {"$set": {"order_status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"}

@api_router.get("/admin/customers")
async def admin_get_customers(user: dict = Depends(get_admin_user)):
    customers = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return {"customers": customers}

@api_router.post("/admin/promotions", response_model=Promotion)
async def admin_create_promotion(promotion: Promotion, user: dict = Depends(get_admin_user)):
    await db.promotions.insert_one(promotion.model_dump())
    return promotion

@api_router.get("/admin/promotions", response_model=List[Promotion])
async def admin_get_promotions(user: dict = Depends(get_admin_user)):
    promotions = await db.promotions.find({}, {"_id": 0}).to_list(1000)
    return promotions

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()