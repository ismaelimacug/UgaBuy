import httpx
import os
from typing import Optional, Dict, Any, List

TECHSPECS_API_KEY = "7730b667-a883-4d1f-b227-9964b2ccd1a8"
TECHSPECS_BASE_URL = "https://api.techspecs.io/v4"


class TechSpecsService:
    """Service to interact with TechSpecs.io API for gadget specifications and images"""
    
    def __init__(self):
        self.api_key = TECHSPECS_API_KEY
        self.base_url = TECHSPECS_BASE_URL
        self.headers = {
            "accept": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "content-type": "application/json"
        }
    
    async def search_product(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for products by name
        
        Args:
            query: Product name (e.g., "iPhone 15 Pro", "Samsung Galaxy S24")
            limit: Number of results to return
            
        Returns:
            List of products with specifications and images
        """
        async with httpx.AsyncClient() as client:
            try:
                # TechSpecs v4 uses POST for search
                response = await client.post(
                    f"{self.base_url}/product/search",
                    headers=self.headers,
                    json={"query": query},
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Log response for debugging
                print(f"TechSpecs API Response: {data}")
                
                # Return limited results - handle different response formats
                if isinstance(data, dict):
                    products = data.get('products', data.get('data', []))
                else:
                    products = data if isinstance(data, list) else []
                    
                return products[:limit]
                
            except httpx.HTTPStatusError as e:
                print(f"TechSpecs HTTP Error: {e.response.status_code} - {e.response.text}")
                return []
            except Exception as e:
                print(f"Error searching TechSpecs: {str(e)}")
                return []
    
    async def get_product_details(self, product_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed specifications for a specific product
        
        Args:
            product_id: TechSpecs product ID
            
        Returns:
            Product details including all specifications and images
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/product/{product_id}",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                return response.json()
                
            except Exception as e:
                print(f"Error getting product details: {str(e)}")
                return None
    
    async def get_all_brands(self) -> List[str]:
        """Get list of all available brands"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/brands",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get('brands', [])
                
            except Exception as e:
                print(f"Error getting brands: {str(e)}")
                return []
    
    async def get_all_categories(self) -> List[str]:
        """Get list of all product categories"""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/categories",
                    headers=self.headers,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get('categories', [])
                
            except Exception as e:
                print(f"Error getting categories: {str(e)}")
                return []
    
    def extract_product_info(self, techspecs_product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract relevant information from TechSpecs product data for UgaBuy
        
        Args:
            techspecs_product: Raw product data from TechSpecs API
            
        Returns:
            Formatted product data for UgaBuy
        """
        specs = techspecs_product.get('specifications', {})
        
        return {
            'name': techspecs_product.get('product_name', ''),
            'brand': techspecs_product.get('brand', ''),
            'category': self._determine_category(techspecs_product.get('category', '')),
            'images': self._extract_images(techspecs_product),
            'specifications': {
                'ram': specs.get('ram', ''),
                'storage': specs.get('storage', specs.get('internal_storage', '')),
                'processor': specs.get('processor', specs.get('cpu', '')),
                'screen_size': specs.get('screen_size', specs.get('display_size', '')),
                'battery': specs.get('battery', specs.get('battery_capacity', '')),
                'camera': specs.get('camera', specs.get('rear_camera', '')),
                'os': specs.get('os', specs.get('operating_system', '')),
            },
            'description': techspecs_product.get('description', ''),
            'launch_price': specs.get('launch_price', 0),
        }
    
    def _extract_images(self, product: Dict[str, Any]) -> List[str]:
        """Extract image URLs from product data"""
        images = []
        
        # TechSpecs provides front_image and back_image
        if 'front_image' in product:
            images.append(product['front_image'])
        if 'back_image' in product:
            images.append(product['back_image'])
        
        # Fallback to images array if available
        if 'images' in product and isinstance(product['images'], list):
            images.extend(product['images'])
        
        return images
    
    def _determine_category(self, techspecs_category: str) -> str:
        """Map TechSpecs category to UgaBuy category"""
        category_mapping = {
            'smartphone': 'Smartphones',
            'mobile': 'Smartphones',
            'laptop': 'Laptops',
            'notebook': 'Laptops',
            'tablet': 'Tablets',
            'headphone': 'Audio',
            'earphone': 'Audio',
            'speaker': 'Audio',
            'smartwatch': 'Wearables',
            'watch': 'Wearables',
        }
        
        category_lower = techspecs_category.lower()
        for key, value in category_mapping.items():
            if key in category_lower:
                return value
        
        return 'Other'


# Global service instance
techspecs_service = TechSpecsService()
