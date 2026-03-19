import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/reviews/${id}`)
    ]).then(([productRes, reviewsRes]) => {
      setProduct(productRes.data);
      setReviews(reviewsRes.data);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.product_id, quantity);
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

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="product-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-4 border border-border">
              {product.images && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-contain p-8 bg-white"
                  data-testid="product-main-image"
                />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-white">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden ${selectedImage === idx ? 'border-primary' : 'border-border'}`}
                    data-testid={`thumbnail-${idx}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 text-sm text-muted-foreground">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="product-name">{product.name}</h1>
            
            {reviews.length > 0 && (
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-muted-foreground">({reviews.length} reviews)</span>
              </div>
            )}

            <div className="text-4xl font-bold text-primary mb-6" data-testid="product-price">{formatPrice(product.price)}</div>

            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${product.condition === 'new' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-white'}`}>
                {product.condition === 'new' ? 'Brand New' : 'Used'}
              </span>
              <span className={`ml-2 inline-block px-3 py-1 rounded text-sm font-medium ${product.stock > 0 ? 'bg-accent text-accent-foreground' : 'bg-destructive text-white'}`} data-testid="stock-status">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    value && (
                      <div key={key} className="border border-border rounded-md p-3">
                        <dt className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</dt>
                        <dd className="text-sm font-medium text-foreground">{value}</dd>
                      </div>
                    )
                  ))}
                </dl>
              </div>
            )}

            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 h-10 px-3 rounded-md border border-input text-center focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="quantity-input"
                  />
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium transition-colors flex items-center justify-center space-x-2"
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.review_id} className="border border-border rounded-lg p-6" data-testid={`review-${review.review_id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{review.user_name}</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;