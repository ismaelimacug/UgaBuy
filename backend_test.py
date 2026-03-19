import requests
import sys
import json
from datetime import datetime

class UgaBuyAPITester:
    def __init__(self, base_url="https://techstore-ug.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_id = None
        self.test_product_id = None
        self.test_order_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_admin=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if use_admin and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_basic_endpoints(self):
        """Test basic endpoints that don't require authentication"""
        print("\n=== TESTING BASIC ENDPOINTS ===")
        
        # Test get products
        success, response = self.run_test("Get Products", "GET", "products", 200)
        if success and response:
            products = response
            if products and len(products) > 0:
                self.test_product_id = products[0].get('product_id')
                print(f"   Found {len(products)} products")
            else:
                print("   Warning: No products found in database")
        
        # Test get featured products
        self.run_test("Get Featured Products", "GET", "products/featured", 200)
        
        # Test get categories
        self.run_test("Get Categories", "GET", "categories", 200)
        
        # Test get brands
        self.run_test("Get Brands", "GET", "brands", 200)
        
        # Test get specific product if we have one
        if self.test_product_id:
            self.run_test("Get Product Detail", "GET", f"products/{self.test_product_id}", 200)

    def test_authentication(self):
        """Test user registration and login"""
        print("\n=== TESTING AUTHENTICATION ===")
        
        # Generate unique test user
        timestamp = datetime.now().strftime('%H%M%S')
        test_email = f"test_user_{timestamp}@ugabuy.com"
        test_password = "TestPass123!"
        
        # Test user registration
        register_data = {
            "email": test_email,
            "name": f"Test User {timestamp}",
            "password": test_password,
            "phone": "+256700000000"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, register_data)
        if success and response:
            self.token = response.get('token')
            user_data = response.get('user', {})
            self.test_user_id = user_data.get('user_id')
            print(f"   Registered user: {user_data.get('name')}")
        
        # Test user login
        login_data = {
            "email": test_email,
            "password": test_password
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        if success and response:
            self.token = response.get('token')
            print(f"   Login successful")
        
        # Test admin login
        admin_login_data = {
            "email": "admin@ugabuy.com",
            "password": "admin123"
        }
        
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, admin_login_data)
        if success and response:
            self.admin_token = response.get('token')
            print(f"   Admin login successful")
        
        # Test get current user
        if self.token:
            self.run_test("Get Current User", "GET", "auth/me", 200)

    def test_cart_operations(self):
        """Test cart functionality"""
        print("\n=== TESTING CART OPERATIONS ===")
        
        if not self.token:
            print("❌ Skipping cart tests - no user token")
            return
        
        if not self.test_product_id:
            print("❌ Skipping cart tests - no product available")
            return
        
        # Test get empty cart
        self.run_test("Get Empty Cart", "GET", "cart", 200)
        
        # Test add to cart
        cart_item = {
            "product_id": self.test_product_id,
            "quantity": 2
        }
        
        self.run_test("Add to Cart", "POST", "cart/add", 200, cart_item)
        
        # Test get cart with items
        success, response = self.run_test("Get Cart with Items", "GET", "cart", 200)
        if success and response:
            items = response.get('items', [])
            print(f"   Cart has {len(items)} items")
        
        # Test update cart
        update_item = {
            "product_id": self.test_product_id,
            "quantity": 3
        }
        
        self.run_test("Update Cart", "PUT", "cart/update", 200, update_item)
        
        # Test remove from cart (we'll add it back for order testing)
        # self.run_test("Remove from Cart", "DELETE", f"cart/remove/{self.test_product_id}", 200)

    def test_order_operations(self):
        """Test order creation and management"""
        print("\n=== TESTING ORDER OPERATIONS ===")
        
        if not self.token or not self.test_product_id:
            print("❌ Skipping order tests - missing token or product")
            return
        
        # Test create order
        order_data = {
            "items": [
                {
                    "product_id": self.test_product_id,
                    "quantity": 1
                }
            ],
            "shipping_address": {
                "name": "Test User",
                "phone": "+256700000000",
                "address": "123 Test Street",
                "city": "Kampala",
                "district": "Central"
            },
            "payment_method": "airtel_money"
        }
        
        success, response = self.run_test("Create Order", "POST", "orders/create", 200, order_data)
        if success and response:
            self.test_order_id = response.get('order_id')
            print(f"   Created order: {self.test_order_id}")
        
        # Test get orders
        self.run_test("Get User Orders", "GET", "orders", 200)
        
        # Test get specific order
        if self.test_order_id:
            self.run_test("Get Order Detail", "GET", f"orders/{self.test_order_id}", 200)

    def test_payment_operations(self):
        """Test payment functionality"""
        print("\n=== TESTING PAYMENT OPERATIONS ===")
        
        if not self.token or not self.test_order_id:
            print("❌ Skipping payment tests - missing token or order")
            return
        
        # Test create checkout session
        checkout_data = {
            "order_id": self.test_order_id,
            "origin_url": "https://techstore-ug.preview.emergentagent.com"
        }
        
        success, response = self.run_test("Create Checkout Session", "POST", "payments/checkout", 200, checkout_data)
        if success and response:
            session_id = response.get('session_id')
            checkout_url = response.get('url')
            print(f"   Checkout URL: {checkout_url}")
            
            # Test get payment status
            if session_id:
                self.run_test("Get Payment Status", "GET", f"payments/status/{session_id}", 200)

    def test_admin_operations(self):
        """Test admin functionality"""
        print("\n=== TESTING ADMIN OPERATIONS ===")
        
        if not self.admin_token:
            print("❌ Skipping admin tests - no admin token")
            return
        
        # Test create product
        product_data = {
            "name": "Test Product",
            "brand": "Test Brand",
            "category": "Electronics",
            "price": 500000,
            "condition": "new",
            "specifications": {
                "ram": "8GB",
                "storage": "256GB"
            },
            "images": ["https://example.com/image.jpg"],
            "stock": 10,
            "description": "Test product description",
            "featured": False
        }
        
        success, response = self.run_test("Admin Create Product", "POST", "admin/products", 200, product_data, use_admin=True)
        created_product_id = None
        if success and response:
            created_product_id = response.get('product_id')
            print(f"   Created product: {created_product_id}")
        
        # Test get admin orders
        self.run_test("Admin Get Orders", "GET", "admin/orders", 200, use_admin=True)
        
        # Test get customers
        self.run_test("Admin Get Customers", "GET", "admin/customers", 200, use_admin=True)
        
        # Test update order status
        if self.test_order_id:
            status_data = {"status": "processing"}
            # Note: This endpoint expects form data, not JSON
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            url = f"{self.base_url}/admin/orders/{self.test_order_id}/status"
            test_headers = {'Authorization': f'Bearer {self.admin_token}'}
            test_headers.update(headers)
            
            try:
                response = requests.put(url, data=status_data, headers=test_headers)
                success = response.status_code == 200
                if success:
                    self.tests_passed += 1
                    print(f"✅ Admin Update Order Status - Status: {response.status_code}")
                else:
                    print(f"❌ Admin Update Order Status - Expected 200, got {response.status_code}")
                self.tests_run += 1
            except Exception as e:
                print(f"❌ Admin Update Order Status - Error: {str(e)}")
                self.tests_run += 1
        
        # Test delete created product
        if created_product_id:
            self.run_test("Admin Delete Product", "DELETE", f"admin/products/{created_product_id}", 200, use_admin=True)

    def test_reviews(self):
        """Test review functionality"""
        print("\n=== TESTING REVIEWS ===")
        
        if not self.token or not self.test_product_id:
            print("❌ Skipping review tests - missing token or product")
            return
        
        # Test get reviews for product
        self.run_test("Get Product Reviews", "GET", f"reviews/{self.test_product_id}", 200)
        
        # Test create review
        review_data = {
            "product_id": self.test_product_id,
            "rating": 5,
            "comment": "Great product! Highly recommended."
        }
        
        self.run_test("Create Review", "POST", "reviews", 200, review_data)

def main():
    print("🚀 Starting UgaBuy API Testing...")
    print("=" * 50)
    
    tester = UgaBuyAPITester()
    
    # Run all test suites
    tester.test_basic_endpoints()
    tester.test_authentication()
    tester.test_cart_operations()
    tester.test_order_operations()
    tester.test_payment_operations()
    tester.test_reviews()
    tester.test_admin_operations()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed - check logs above")
        return 1

if __name__ == "__main__":
    sys.exit(main())