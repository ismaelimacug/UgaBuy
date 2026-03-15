import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { cart, updateCart, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCart(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-8" data-testid="cart-title">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-cart">
            <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium transition-colors"
              data-testid="continue-shopping"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map(item => (
                <div key={item.product.product_id} className="bg-white border border-border rounded-lg p-4 flex gap-4" data-testid={`cart-item-${item.product.product_id}`}>
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images && item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                    <div className="text-lg font-bold text-primary">{formatPrice(item.product.price)}</div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.product.product_id)}
                      className="text-destructive hover:text-destructive/80"
                      data-testid={`remove-${item.product.product_id}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <div className="flex items-center border border-border rounded-md">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity - 1)}
                        className="p-2 hover:bg-accent"
                        disabled={item.quantity <= 1}
                        data-testid={`decrease-${item.product.product_id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 font-medium" data-testid={`quantity-${item.product.product_id}`}>{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.product_id, item.quantity + 1)}
                        className="p-2 hover:bg-accent"
                        disabled={item.quantity >= item.product.stock}
                        data-testid={`increase-${item.product.product_id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-muted border border-border rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-xl text-primary" data-testid="cart-total">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 font-medium transition-colors"
                  data-testid="checkout-button"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;