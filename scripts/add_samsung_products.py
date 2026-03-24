import asyncio
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))

from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import uuid

ROOT_DIR = Path(__file__).parent.parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

# Samsung Galaxy phones data
samsung_products = [
    # Galaxy F17 5G
    {
        "name": "Samsung Galaxy F17 5G",
        "variant": "Neo Black 4GB/128GB",
        "price": 570000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Neo Black",
        "specs": {
            "processor": "MediaTek Dimensity 6300",
            "screen_size": "6.6 inches HD+",
            "battery": "5000 mAh",
            "camera": "50MP + 2MP Dual",
            "front_camera": "8MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy F17 5G",
        "variant": "Violet Pop 4GB/128GB",
        "price": 570000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Violet Pop",
        "specs": {
            "processor": "MediaTek Dimensity 6300",
            "screen_size": "6.6 inches HD+",
            "battery": "5000 mAh",
            "camera": "50MP + 2MP Dual",
            "front_camera": "8MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy M17 5G
    {
        "name": "Samsung Galaxy M17 5G",
        "variant": "Sapphire Black 4GB/128GB",
        "price": 570000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Sapphire Black",
        "specs": {
            "processor": "MediaTek Dimensity 6300",
            "screen_size": "6.6 inches HD+",
            "battery": "5000 mAh",
            "camera": "50MP + 2MP Dual",
            "front_camera": "8MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy M36 5G
    {
        "name": "Samsung Galaxy M36 5G",
        "variant": "Black 6GB/128GB",
        "price": 660000,
        "ram": "6GB",
        "storage": "128GB",
        "color": "Black",
        "specs": {
            "processor": "Qualcomm Snapdragon 7 Gen 1",
            "screen_size": "6.6 inches FHD+ Super AMOLED",
            "battery": "6000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A07 4G
    {
        "name": "Samsung Galaxy A07 4G",
        "variant": "Green 4GB/128GB",
        "price": 430000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Green",
        "specs": {
            "processor": "MediaTek Helio G85",
            "screen_size": "6.6 inches HD+",
            "battery": "5000 mAh",
            "camera": "50MP + 2MP Dual",
            "front_camera": "8MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A07 4G",
        "variant": "Black 4GB/128GB",
        "price": 430000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Black",
        "specs": {
            "processor": "MediaTek Helio G85",
            "screen_size": "6.6 inches HD+",
            "battery": "5000 mAh",
            "camera": "50MP + 2MP Dual",
            "front_camera": "8MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A17 4G - 4GB/128GB variants
    {
        "name": "Samsung Galaxy A17 4G",
        "variant": "Gray 4GB/128GB",
        "price": 580000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Gray",
        "specs": {
            "processor": "MediaTek Helio G99",
            "screen_size": "6.7 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A17 4G",
        "variant": "Black 4GB/128GB",
        "price": 580000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Black",
        "specs": {
            "processor": "MediaTek Helio G99",
            "screen_size": "6.7 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A17 4G",
        "variant": "Light Blue 4GB/128GB",
        "price": 570000,
        "ram": "4GB",
        "storage": "128GB",
        "color": "Light Blue",
        "specs": {
            "processor": "MediaTek Helio G99",
            "screen_size": "6.7 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A17 4G - 8GB/256GB variants
    {
        "name": "Samsung Galaxy A17 4G",
        "variant": "Gray 8GB/256GB",
        "price": 700000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Gray",
        "specs": {
            "processor": "MediaTek Helio G99",
            "screen_size": "6.7 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A17 4G",
        "variant": "Black 8GB/256GB",
        "price": 700000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Black",
        "specs": {
            "processor": "MediaTek Helio G99",
            "screen_size": "6.7 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A17 4G",
        "variant": "Light Blue 8GB/256GB",
        "price": 690000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Light Blue",
        "specs": {
            "processor": "MediaTek Helio G99",
            "screen_size": "6.7 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "4G LTE"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A26 5G - 6GB/128GB variants
    {
        "name": "Samsung Galaxy A26 5G",
        "variant": "Black 6GB/128GB",
        "price": 750000,
        "ram": "6GB",
        "storage": "128GB",
        "color": "Black",
        "specs": {
            "processor": "Exynos 1280",
            "screen_size": "6.5 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 5MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A26 5G",
        "variant": "White 6GB/128GB",
        "price": 740000,
        "ram": "6GB",
        "storage": "128GB",
        "color": "White",
        "specs": {
            "processor": "Exynos 1280",
            "screen_size": "6.5 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 5MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A26 5G - 8GB/256GB variants
    {
        "name": "Samsung Galaxy A26 5G",
        "variant": "Pink 8GB/256GB",
        "price": 830000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Pink",
        "specs": {
            "processor": "Exynos 1280",
            "screen_size": "6.5 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 5MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A26 5G",
        "variant": "Mint 8GB/256GB",
        "price": 830000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Mint",
        "specs": {
            "processor": "Exynos 1280",
            "screen_size": "6.5 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 5MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A26 5G",
        "variant": "Black 8GB/256GB",
        "price": 830000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Black",
        "specs": {
            "processor": "Exynos 1280",
            "screen_size": "6.5 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 5MP + 2MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A36 5G - 6GB/128GB
    {
        "name": "Samsung Galaxy A36 5G",
        "variant": "Awesome Graphite 6GB/128GB",
        "price": 860000,
        "ram": "6GB",
        "storage": "128GB",
        "color": "Awesome Graphite",
        "specs": {
            "processor": "Qualcomm Snapdragon 6 Gen 1",
            "screen_size": "6.6 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 5MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A36 5G - 8GB/256GB
    {
        "name": "Samsung Galaxy A36 5G",
        "variant": "Awesome Graphite 8GB/256GB",
        "price": 1010000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Awesome Graphite",
        "specs": {
            "processor": "Qualcomm Snapdragon 6 Gen 1",
            "screen_size": "6.6 inches FHD+ Super AMOLED",
            "battery": "5000 mAh",
            "camera": "50MP + 8MP + 5MP Triple",
            "front_camera": "13MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A56 5G - 8GB/128GB
    {
        "name": "Samsung Galaxy A56 5G",
        "variant": "Awesome Graphite 8GB/128GB",
        "price": 1040000,
        "ram": "8GB",
        "storage": "128GB",
        "color": "Awesome Graphite",
        "specs": {
            "processor": "Exynos 1480",
            "screen_size": "6.7 inches FHD+ Super AMOLED 120Hz",
            "battery": "5000 mAh",
            "camera": "50MP + 12MP + 5MP Triple",
            "front_camera": "32MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A56 5G - 8GB/256GB variants
    {
        "name": "Samsung Galaxy A56 5G",
        "variant": "Awesome Gray 8GB/256GB",
        "price": 1260000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Awesome Gray",
        "specs": {
            "processor": "Exynos 1480",
            "screen_size": "6.7 inches FHD+ Super AMOLED 120Hz",
            "battery": "5000 mAh",
            "camera": "50MP + 12MP + 5MP Triple",
            "front_camera": "32MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A56 5G",
        "variant": "Awesome Olive 8GB/256GB",
        "price": 1260000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Awesome Olive",
        "specs": {
            "processor": "Exynos 1480",
            "screen_size": "6.7 inches FHD+ Super AMOLED 120Hz",
            "battery": "5000 mAh",
            "camera": "50MP + 12MP + 5MP Triple",
            "front_camera": "32MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    {
        "name": "Samsung Galaxy A56 5G",
        "variant": "Awesome Graphite 8GB/256GB",
        "price": 1260000,
        "ram": "8GB",
        "storage": "256GB",
        "color": "Awesome Graphite",
        "specs": {
            "processor": "Exynos 1480",
            "screen_size": "6.7 inches FHD+ Super AMOLED 120Hz",
            "battery": "5000 mAh",
            "camera": "50MP + 12MP + 5MP Triple",
            "front_camera": "32MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
    # Galaxy A56 5G - 12GB/256GB
    {
        "name": "Samsung Galaxy A56 5G",
        "variant": "Awesome Graphite 12GB/256GB",
        "price": 1280000,
        "ram": "12GB",
        "storage": "256GB",
        "color": "Awesome Graphite",
        "specs": {
            "processor": "Exynos 1480",
            "screen_size": "6.7 inches FHD+ Super AMOLED 120Hz",
            "battery": "5000 mAh",
            "camera": "50MP + 12MP + 5MP Triple",
            "front_camera": "32MP",
            "os": "Android 14",
            "network": "5G"
        },
        "image": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800"
    },
]

async def add_samsung_products():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    added_count = 0
    
    for product_data in samsung_products:
        # Check if product already exists
        existing = await db.products.find_one({
            "name": product_data["name"],
            "specifications.ram": product_data["ram"],
            "specifications.storage": product_data["storage"]
        })
        
        if existing:
            print(f"⚠ Skipped: {product_data['name']} {product_data['variant']} (already exists)")
            continue
        
        # Create product document
        product = {
            "product_id": str(uuid.uuid4()),
            "name": f"{product_data['name']} ({product_data['variant']})",
            "brand": "Samsung",
            "category": "Smartphones",
            "price": float(product_data["price"]),
            "condition": "new",
            "specifications": {
                "ram": product_data["ram"],
                "storage": product_data["storage"],
                "processor": product_data["specs"]["processor"],
                "screen_size": product_data["specs"]["screen_size"],
                "battery": product_data["specs"]["battery"],
                "camera": product_data["specs"]["camera"],
                "os": product_data["specs"]["os"]
            },
            "images": [product_data["image"]],
            "stock": 10,
            "description": f"{product_data['name']} in {product_data['color']} with {product_data['ram']} RAM and {product_data['storage']} storage. Features {product_data['specs']['camera']} camera system, {product_data['specs']['battery']} battery, and {product_data['specs']['screen_size']} display. {product_data['specs']['network']} connectivity.",
            "featured": False,
            "created_at": "2026-01-19T10:00:00Z"
        }
        
        await db.products.insert_one(product)
        added_count += 1
        print(f"✓ Added: {product['name']} - UGX {product_data['price']:,}")
    
    client.close()
    print(f"\n✅ Successfully added {added_count} Samsung Galaxy phones!")
    print(f"📱 Total products now available in catalog")

if __name__ == "__main__":
    asyncio.run(add_samsung_products())
