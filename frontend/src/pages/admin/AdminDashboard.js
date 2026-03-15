import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.is_admin) {
      Promise.all([
        api.get('/admin/orders'),
        api.get('/products'),
        api.get('/admin/customers')
      ]).then(([ordersRes, productsRes, customersRes]) => {
        setStats({
          totalOrders: ordersRes.data.length,
          totalProducts: productsRes.data.length,
          totalCustomers: customersRes.data.customers.length,
          recentOrders: ordersRes.data.slice(0, 5)
        });
      }).finally(() => setLoading(false));
    }
  }, [user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-8" data-testid="admin-title">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-border rounded-lg p-6" data-testid="stat-orders">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <div className="text-3xl font-bold text-foreground">{stats.totalOrders}</div>
              </div>
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-lg p-6" data-testid="stat-products">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Products</div>
                <div className="text-3xl font-bold text-foreground">{stats.totalProducts}</div>
              </div>
              <Package className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="bg-white border border-border rounded-lg p-6" data-testid="stat-customers">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Customers</div>
                <div className="text-3xl font-bold text-foreground">{stats.totalCustomers}</div>
              </div>
              <Users className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="block p-4 border border-border rounded-lg hover:border-primary transition-colors"
                data-testid="link-manage-products"
              >
                <div className="font-medium">Manage Products</div>
                <div className="text-sm text-muted-foreground">Add, edit, or remove products</div>
              </Link>
              <Link
                to="/admin/orders"
                className="block p-4 border border-border rounded-lg hover:border-primary transition-colors"
                data-testid="link-manage-orders"
              >
                <div className="font-medium">Manage Orders</div>
                <div className="text-sm text-muted-foreground">View and update order status</div>
              </Link>
              <Link
                to="/admin/promotions"
                className="block p-4 border border-border rounded-lg hover:border-primary transition-colors"
                data-testid="link-manage-promotions"
              >
                <div className="font-medium">Manage Promotions</div>
                <div className="text-sm text-muted-foreground">Create and manage discount offers</div>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary hover:underline text-sm">View All</Link>
            </div>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map(order => (
                  <div key={order.order_id} className="p-3 border border-border rounded-lg" data-testid={`recent-order-${order.order_id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">Order #{order.order_id.slice(0, 8)}</div>
                        <div className="text-xs text-muted-foreground">{order.items.length} items</div>
                      </div>
                      <div className="text-sm font-semibold text-primary">{formatPrice(order.total_amount)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No recent orders</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;