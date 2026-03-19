import React from 'react';
import { Package, RefreshCw, Clock, CheckCircle } from 'lucide-react';

const Returns = () => {
  return (
    <div className="min-h-screen bg-white" data-testid="returns-page">
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-center">
            Return & Refund Policy
          </h1>
          <p className="text-lg text-muted-foreground text-center">Your satisfaction is our priority</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 border border-border rounded-lg">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">7-Day Return</h3>
            <p className="text-sm text-muted-foreground">Return within 7 days of delivery</p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Original Packaging</h3>
            <p className="text-sm text-muted-foreground">Items must be in original condition</p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg">
            <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">Simple return process</p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Full Refund</h3>
            <p className="text-sm text-muted-foreground">Money back or exchange</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Return Policy Overview</h2>
            <p className="text-muted-foreground">
              At UgaBuy, we want you to be completely satisfied with your purchase. If you're not happy with your product, we offer a hassle-free return policy within 7 days of delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Eligibility for Returns</h2>
            <p className="text-muted-foreground mb-4">To be eligible for a return, your item must meet the following conditions:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Product must be unused and in the same condition as received</li>
              <li>Original packaging, accessories, and documentation must be included</li>
              <li>Proof of purchase (receipt or order confirmation) required</li>
              <li>Return must be initiated within 7 days of delivery</li>
              <li>Product must not show signs of wear or damage</li>
              <li>All protective films and seals must be intact (where applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Non-Returnable Items</h2>
            <p className="text-muted-foreground mb-4">The following items cannot be returned:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Opened software or digital products</li>
              <li>Products marked as "Final Sale" or "Clearance"</li>
              <li>Gift cards</li>
              <li>Hygiene-related products (earphones, earbuds) once opened</li>
              <li>Customized or personalized items</li>
              <li>Products damaged due to misuse or accident</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">How to Initiate a Return</h2>
            <div className="bg-accent rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Step 1: Contact Us</h3>
                <p className="text-muted-foreground">
                  Call us at +256 753 645 800 or email kaluleismaelimac@gmail.com with your order number and reason for return.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Step 2: Get Authorization</h3>
                <p className="text-muted-foreground">
                  Our team will review your request and provide a Return Authorization Number (RAN) within 24 hours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Step 3: Pack Your Item</h3>
                <p className="text-muted-foreground">
                  Securely pack the item with all original packaging, accessories, and the RAN clearly visible.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Step 4: Ship or Drop Off</h3>
                <p className="text-muted-foreground">
                  Return the item to our Kampala location or use our courier pickup service (fees may apply).
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Refund Process</h2>
            <p className="text-muted-foreground mb-4">
              Once we receive and inspect your return:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Inspection typically takes 2-3 business days</li>
              <li>You'll receive email confirmation once inspection is complete</li>
              <li>Approved refunds are processed within 5-7 business days</li>
              <li>Refunds are issued to the original payment method</li>
              <li>Mobile Money refunds: 1-2 business days</li>
              <li>Card refunds: 5-10 business days (depending on your bank)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Exchanges</h2>
            <p className="text-muted-foreground">
              If you need to exchange an item for a different model or color, follow the return process above and place a new order for the desired item. This ensures the fastest service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Defective or Damaged Items</h2>
            <p className="text-muted-foreground mb-4">
              If you receive a defective or damaged item:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Contact us immediately within 48 hours of delivery</li>
              <li>Provide photos of the damage or defect</li>
              <li>We'll arrange for free pickup and replacement</li>
              <li>Shipping costs for defective items are covered by UgaBuy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Warranty Claims</h2>
            <p className="text-muted-foreground">
              Products under manufacturer warranty should be handled according to the manufacturer's warranty policy. Contact us for assistance with warranty claims, and we'll guide you through the process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Questions?</h2>
            <p className="text-muted-foreground">
              If you have any questions about our return policy, please don't hesitate to contact us:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong>Email:</strong> kaluleismaelimac@gmail.com</li>
              <li><strong>Phone:</strong> +256 753 645 800</li>
              <li><strong>WhatsApp:</strong> +256 753 645 800</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Returns;