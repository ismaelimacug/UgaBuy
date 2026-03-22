import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Smartphone, Laptop, Headphones, Watch } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories] = useState([
    { name: 'Smartphones', icon: Smartphone, path: '/products?category=Smartphones' },
    { name: 'Laptops', icon: Laptop, path: '/products?category=Laptops' },
    { name: 'Audio', icon: Headphones, path: '/products?category=Audio' },
    { name: 'Wearables', icon: Watch, path: '/products?category=Wearables' }
  ]);

  useEffect(() => {
    api.get('/products/featured').then(response => {
      setFeaturedProducts(response.data.slice(0, 8));
    });
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <section className="hero-gradient py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6" data-testid="hero-title">
              Uganda's Premier Tech Marketplace
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Shop the latest smartphones, laptops, and gadgets. Quality products at unbeatable prices.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 font-medium transition-colors"
              data-testid="shop-now-button"
            >
              Shop Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground mb-12 text-center" data-testid="categories-title">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.path}
                  className="p-6 border border-border bg-card rounded-lg hover:border-primary/50 hover:bg-accent transition-all flex flex-col items-center justify-center space-y-4"
                  data-testid={`category-${category.name.toLowerCase()}`}
                >
                  <Icon className="h-12 w-12 text-primary" />
                  <span className="font-medium text-foreground">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground" data-testid="featured-title">
                Featured Deals
              </h2>
              <Link to="/products" className="text-primary hover:underline font-medium" data-testid="view-all-link">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your gadgets delivered across Uganda</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Products</h3>
              <p className="text-muted-foreground">100% authentic gadgets from trusted brands</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">Pay with Mobile Money or Card</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;