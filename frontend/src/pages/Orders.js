import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package } from 'lucide-react';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('/orders')
        .then(response => {
          setOrders(response.data);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

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
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="orders-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-8" data-testid="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12" data-testid="no-orders">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg mb-4">You haven't placed any orders yet</p>
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium transition-colors"
              data-testid="start-shopping"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Link
                key={order.order_id}
                to={`/orders/${order.order_id}`}
                className="block bg-white border border-border rounded-lg p-6 hover:border-primary transition-colors"
                data-testid={`order-${order.order_id}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Order #{order.order_id.slice(0, 8)}</div>
                    <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(order.order_status)}`} data-testid={`status-${order.order_id}`}>
                      {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      Payment: {order.payment_status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground"> x {item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-primary" data-testid={`total-${order.order_id}`}>{formatPrice(order.total_amount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;