import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product.product_id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link to={`/products/${product.product_id}`} className="product-card block bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all" data-testid={`product-card-${product.product_id}`}>
      <div className="relative overflow-hidden h-48 bg-[#1a1f2e]">
        {product.images && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-image w-full h-full object-contain p-4 bg-white rounded-lg m-2"
            style={{height: '11rem', width: 'calc(100% - 1rem)'}}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white m-2 rounded-lg">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        {product.condition === 'used' && (
          <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded">Used</span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-1 rounded">Out of Stock</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors"
              data-testid={`add-to-cart-${product.product_id}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;