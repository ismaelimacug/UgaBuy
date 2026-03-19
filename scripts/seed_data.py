import asyncio
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import bcrypt

ROOT_DIR = Path(__file__).parent.parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def seed_data():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Create admin user
    admin_exists = await db.users.find_one({"email": "admin@ugabuy.com"})
    if not admin_exists:
        admin_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_user = {
            "user_id": "admin-001",
            "email": "admin@ugabuy.com",
            "phone": "+256700000000",
            "name": "Admin User",
            "password_hash": admin_password,
            "addresses": [],
            "is_admin": True,
            "created_at": "2026-01-15T10:00:00Z"
        }
        await db.users.insert_one(admin_user)
        print("✓ Admin user created (admin@ugabuy.com / admin123)")
    
    # Check if products already exist
    existing_count = await db.products.count_documents({})
    if existing_count > 0:
        print(f"✓ Database already has {existing_count} products")
        client.close()
        return
    
    # Sample products
    products = [
        {
            "product_id": "prod-001",
            "name": "iPhone 15 Pro Max",
            "brand": "Apple",
            "category": "Smartphones",
            "price": 4500000.0,
            "condition": "new",
            "specifications": {
                "ram": "8GB",
                "storage": "256GB",
                "processor": "A17 Pro",
                "screen_size": "6.7 inches",
                "battery": "4422 mAh",
                "camera": "48MP + 12MP + 12MP",
                "os": "iOS 17"
            },
            "images": ["https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=800&bg=white"],
            "stock": 15,
            "description": "Latest iPhone with titanium design and advanced camera system",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-002",
            "name": "Samsung Galaxy S24 Ultra",
            "brand": "Samsung",
            "category": "Smartphones",
            "price": 4200000.0,
            "condition": "new",
            "specifications": {
                "ram": "12GB",
                "storage": "512GB",
                "processor": "Snapdragon 8 Gen 3",
                "screen_size": "6.8 inches",
                "battery": "5000 mAh",
                "camera": "200MP + 50MP + 12MP",
                "os": "Android 14"
            },
            "images": ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500"],
            "stock": 20,
            "description": "Flagship Samsung with AI features and S Pen",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-003",
            "name": "MacBook Pro 16\" M3 Max",
            "brand": "Apple",
            "category": "Laptops",
            "price": 12000000.0,
            "condition": "new",
            "specifications": {
                "ram": "36GB",
                "storage": "1TB SSD",
                "processor": "Apple M3 Max",
                "screen_size": "16.2 inches",
                "battery": "100 Wh",
                "camera": "1080p FaceTime HD",
                "os": "macOS Sonoma"
            },
            "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"],
            "stock": 8,
            "description": "Professional laptop with incredible performance",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-004",
            "name": "Dell XPS 15",
            "brand": "Dell",
            "category": "Laptops",
            "price": 6500000.0,
            "condition": "new",
            "specifications": {
                "ram": "32GB",
                "storage": "1TB SSD",
                "processor": "Intel Core i9-13900H",
                "screen_size": "15.6 inches",
                "battery": "86 Wh",
                "camera": "720p HD",
                "os": "Windows 11"
            },
            "images": ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500"],
            "stock": 12,
            "description": "Premium Windows laptop with stunning OLED display",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-005",
            "name": "AirPods Pro (2nd Gen)",
            "brand": "Apple",
            "category": "Audio",
            "price": 900000.0,
            "condition": "new",
            "specifications": {
                "battery": "30 hours with case",
                "connectivity": "Bluetooth 5.3",
                "features": "Active Noise Cancellation"
            },
            "images": ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500"],
            "stock": 50,
            "description": "Premium wireless earbuds with spatial audio",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-006",
            "name": "Sony WH-1000XM5",
            "brand": "Sony",
            "category": "Audio",
            "price": 1400000.0,
            "condition": "new",
            "specifications": {
                "battery": "40 hours",
                "connectivity": "Bluetooth 5.2",
                "features": "Industry-leading noise cancellation"
            },
            "images": ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"],
            "stock": 30,
            "description": "Premium over-ear headphones with excellent sound quality",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-007",
            "name": "Apple Watch Series 9",
            "brand": "Apple",
            "category": "Wearables",
            "price": 1600000.0,
            "condition": "new",
            "specifications": {
                "screen_size": "45mm",
                "battery": "18 hours",
                "features": "ECG, Blood Oxygen"
            },
            "images": ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"],
            "stock": 25,
            "description": "Advanced smartwatch with health monitoring",
            "featured": True,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-008",
            "name": "iPad Pro 12.9\" M2",
            "brand": "Apple",
            "category": "Tablets",
            "price": 5000000.0,
            "condition": "new",
            "specifications": {
                "ram": "16GB",
                "storage": "512GB",
                "processor": "Apple M2",
                "screen_size": "12.9 inches",
                "battery": "10 hours",
                "os": "iPadOS 17"
            },
            "images": ["https://images.unsplash.com/photo-1585790050230-5dd28404f869?w=500"],
            "stock": 18,
            "description": "Powerful tablet for creative professionals",
            "featured": False,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-009",
            "name": "Xiaomi Redmi Note 13 Pro",
            "brand": "Xiaomi",
            "category": "Smartphones",
            "price": 1200000.0,
            "condition": "new",
            "specifications": {
                "ram": "8GB",
                "storage": "256GB",
                "processor": "Snapdragon 7s Gen 2",
                "screen_size": "6.67 inches",
                "battery": "5000 mAh",
                "camera": "200MP + 8MP + 2MP",
                "os": "Android 13"
            },
            "images": ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500"],
            "stock": 40,
            "description": "Affordable smartphone with flagship features",
            "featured": False,
            "created_at": "2026-01-15T10:00:00Z"
        },
        {
            "product_id": "prod-010",
            "name": "Lenovo ThinkPad X1 Carbon",
            "brand": "Lenovo",
            "category": "Laptops",
            "price": 5500000.0,
            "condition": "new",
            "specifications": {
                "ram": "16GB",
                "storage": "512GB SSD",
                "processor": "Intel Core i7-1365U",
                "screen_size": "14 inches",
                "battery": "57 Wh",
                "os": "Windows 11 Pro"
            },
            "images": ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500"],
            "stock": 15,
            "description": "Business laptop with military-grade durability",
            "featured": False,
            "created_at": "2026-01-15T10:00:00Z"
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✓ Added {len(products)} sample products")
    
    client.close()
    print("\n✓ Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
