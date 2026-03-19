import React from 'react';
import { ShoppingBag, Shield, Truck, HeadphonesIcon } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-center" data-testid="about-title">
            About UgaBuy
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Your trusted tech marketplace in Uganda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="https://customer-assets.emergentagent.com/job_techstore-ug/artifacts/kju79vt4_ugabuy%20logo.jpg" 
              alt="UgaBuy Logo" 
              className="w-full max-w-md mx-auto"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in the heart of Kampala, UgaBuy emerged from a simple vision: to make quality technology accessible to every Ugandan. We recognized the challenges people faced when trying to purchase authentic gadgets - from limited options to concerns about quality and pricing.
              </p>
              <p>
                What started as a small venture has grown into Uganda's premier tech marketplace, serving thousands of satisfied customers across the country. We've built our reputation on three core principles: authenticity, affordability, and exceptional customer service.
              </p>
              <p>
                Today, UgaBuy offers an extensive range of smartphones, laptops, audio equipment, wearables, and accessories from world-renowned brands. Whether you're a student looking for your first laptop, a professional upgrading your work setup, or a tech enthusiast seeking the latest gadgets, we're here to serve you.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why Choose UgaBuy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Authentic</h3>
              <p className="text-muted-foreground text-sm">All products are genuine and sourced directly from authorized distributors</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-muted-foreground text-sm">Competitive pricing with regular discounts and special offers</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm">Quick and reliable delivery across Uganda</p>
            </div>
            <div className="text-center p-6 border border-border rounded-lg">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Dedicated customer support team ready to assist you</p>
            </div>
          </div>
        </div>

        <div className="bg-accent rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To empower Ugandans with access to cutting-edge technology, ensuring that everyone can enjoy the benefits of modern gadgets without compromise. We strive to be more than just a marketplace - we're your trusted technology partner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;