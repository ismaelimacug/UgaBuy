import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="terms-page">
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-center">
            Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground text-center">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using UgaBuy's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Use of Service</h2>
            <p className="text-muted-foreground mb-4">
              UgaBuy provides an online marketplace for purchasing tech gadgets and accessories. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service only for lawful purposes</li>
              <li>Not engage in any fraudulent activities</li>
              <li>Not attempt to interfere with the proper functioning of the website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Product Information</h2>
            <p className="text-muted-foreground">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Pricing and Payment</h2>
            <p className="text-muted-foreground mb-4">
              All prices are listed in Ugandan Shillings (UGX) and are subject to change without notice. We accept:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Credit and Debit Cards (via Stripe)</li>
              <li>MTN Mobile Money</li>
              <li>Airtel Money</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Payment must be received before order processing. We reserve the right to cancel orders if payment is not completed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Order Processing and Delivery</h2>
            <p className="text-muted-foreground">
              Orders are typically processed within 1-2 business days. Delivery times vary based on location within Uganda. We are not responsible for delays caused by courier services or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Warranty and Returns</h2>
            <p className="text-muted-foreground">
              All products sold are covered by manufacturer warranties where applicable. Please refer to our Return Policy for detailed information on returns and exchanges.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              UgaBuy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on this website, including text, graphics, logos, images, and software, is the property of UgaBuy or its content suppliers and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Your continued use of the service constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms & Conditions, please contact us at:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong>Email:</strong> kaluleismaelimac@gmail.com</li>
              <li><strong>Phone:</strong> +256 753 645 800</li>
              <li><strong>Address:</strong> Kampala, Uganda</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;