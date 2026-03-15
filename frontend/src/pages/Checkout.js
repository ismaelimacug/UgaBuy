import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    full_name: user?.name || '',
    phone: user?.phone || '',
    address_line: '',
    city: '',
    postal_code: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (cart.items.length === 0) {
      navigate('/cart');
    }
  }, [user, cart, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateTotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderItems = cart.items.map(item => ({
        product_id: item.product.product_id,
        quantity: item.quantity
      }));

      const orderResponse = await api.post('/orders/create', {
        items: orderItems,
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      });

      const order = orderResponse.data;

      if (paymentMethod === 'card') {
        const checkoutResponse = await api.post('/payments/checkout', {
          order_id: order.order_id,
          origin_url: window.location.origin
        });

        window.location.href = checkoutResponse.data.url;
      } else {
        toast.success('Order placed! You can pay via Mobile Money on delivery');
        navigate(`/orders/${order.order_id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" data-testid="checkout-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-8" data-testid="checkout-title">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.full_name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, full_name: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-fullname"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address_line}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address_line: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                        data-testid="input-city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={shippingAddress.postal_code}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postal_code: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                        data-testid="input-postal"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                      data-testid="payment-card"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">Pay securely with Stripe</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="airtel"
                      checked={paymentMethod === 'airtel'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                      data-testid="payment-airtel"
                    />
                    <div className="flex-1">
                      <div className="font-medium">Airtel Money</div>
                      <div className="text-sm text-muted-foreground">Pay on delivery</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary">
                    <input
                      type="radio"
                      name="payment"
                      value="mtn"
                      checked={paymentMethod === 'mtn'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-primary"
                      data-testid="payment-mtn"
                    />
                    <div className="flex-1">
                      <div className="font-medium">MTN Mobile Money</div>
                      <div className="text-sm text-muted-foreground">Pay on delivery</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-muted border border-border rounded-lg p-6 sticky top-20">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {cart.items.map(item => (
                    <div key={item.product.product_id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.product.name} x {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-xl text-primary" data-testid="order-total">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50"
                  data-testid="place-order-button"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;