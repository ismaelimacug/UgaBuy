import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-secondary border-b border-border sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center" data-testid="nav-logo">
            <img 
              src="https://customer-assets.emergentagent.com/job_techstore-ug/artifacts/kju79vt4_ugabuy%20logo.jpg" 
              alt="UgaBuy" 
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full h-10 pl-4 pr-10 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="search-input"
                />
                <button type="submit" className="absolute right-2 top-2" data-testid="search-button">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/products"
              className="text-foreground hover:text-primary font-medium transition-colors"
              data-testid="nav-products"
            >
              Products
            </Link>
            {user ? (
              <>
                <Link to="/cart" className="relative" data-testid="nav-cart">
                  <ShoppingCart className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
                  {getCartCount() > 0 && (
                    <span className="cart-badge absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="cart-count">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="text-foreground hover:text-primary font-medium transition-colors"
                  data-testid="nav-orders"
                >
                  Orders
                </Link>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="text-foreground hover:text-primary font-medium transition-colors"
                    data-testid="nav-admin"
                  >
                    Admin
                  </Link>
                )}
                <Link to="/profile" data-testid="nav-profile">
                  <User className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
                </Link>
                <button onClick={handleLogout} data-testid="nav-logout">
                  <LogOut className="h-6 w-6 text-foreground hover:text-destructive transition-colors" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 font-medium transition-colors"
                data-testid="nav-login"
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full h-10 pl-4 pr-10 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="absolute right-2 top-2">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </button>
              </div>
            </form>
            <Link to="/products" className="block py-2 text-foreground hover:text-primary">Products</Link>
            {user ? (
              <>
                <Link to="/cart" className="block py-2 text-foreground hover:text-primary">Cart ({getCartCount()})</Link>
                <Link to="/orders" className="block py-2 text-foreground hover:text-primary">Orders</Link>
                {user.is_admin && <Link to="/admin" className="block py-2 text-foreground hover:text-primary">Admin</Link>}
                <Link to="/profile" className="block py-2 text-foreground hover:text-primary">Profile</Link>
                <button onClick={handleLogout} className="block py-2 text-destructive">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-primary font-medium">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;