import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (sessionId && order?.payment_status !== 'paid') {
      pollPaymentStatus(sessionId);
    }
  }, [sessionId, order]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      toast.error('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    if (attempts >= 5) {
      toast.error('Payment verification timeout. Please refresh the page.');
      setPolling(false);
      return;
    }

    setPolling(true);
    try {
      const response = await api.get(`/payments/status/${sessionId}`);
      if (response.data.payment_status === 'paid') {
        toast.success('Payment successful!');
        await fetchOrder();
        setPolling(false);
      } else if (response.data.status === 'expired') {
        toast.error('Payment session expired');
        setPolling(false);
      } else {
        setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
      }
    } catch (error) {
      setPolling(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock className="h-6 w-6" />,
      processing: <Package className="h-6 w-6" />,
      shipped: <Truck className="h-6 w-6" />,
      delivered: <CheckCircle className="h-6 w-6" />
    };
    return icons[status] || <Package className="h-6 w-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="order-detail-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-2" data-testid="order-detail-title">
            Order #{order.order_id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
        </div>

        {polling && (
          <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4 mb-6" data-testid="payment-processing">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Processing payment...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>
              <div className="flex items-center space-x-4">
                <div className="text-primary">
                  {getStatusIcon(order.order_status)}
                </div>
                <div>
                  <div className="font-medium capitalize" data-testid="order-status">{order.order_status}</div>
                  <div className="text-sm text-muted-foreground">Updated {formatDate(order.updated_at)}</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-border last:border-0" data-testid={`order-item-${idx}`}>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-muted-foreground">
                <div>{order.shipping_address.full_name}</div>
                <div>{order.shipping_address.phone}</div>
                <div>{order.shipping_address.address_line}</div>
                <div>{order.shipping_address.city} {order.shipping_address.postal_code}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-muted border border-border rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`} data-testid="payment-status">
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-xl text-primary" data-testid="order-total-amount">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;