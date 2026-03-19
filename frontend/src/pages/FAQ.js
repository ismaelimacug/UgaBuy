import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'Orders & Payment',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept MTN Mobile Money, Airtel Money, and credit/debit cards through our secure Stripe payment gateway.'
        },
        {
          q: 'How long does order processing take?',
          a: 'Orders are typically processed within 1-2 business days after payment confirmation. You\'ll receive a confirmation email once your order is dispatched.'
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'You can modify or cancel your order within 2 hours of placing it. After that, the order enters processing and cannot be changed. Contact us immediately at +256 753 645 800 if you need to make changes.'
        },
        {
          q: 'Do you offer installment payments?',
          a: 'Currently, we only accept full payment at checkout. However, we regularly offer promotional discounts and special deals that make our products more affordable.'
        }
      ]
    },
    {
      category: 'Delivery & Shipping',
      questions: [
        {
          q: 'What are your delivery areas?',
          a: 'We deliver across Uganda, including Kampala, Entebbe, Jinja, Mbarara, Gulu, and other major towns. Delivery times may vary based on location.'
        },
        {
          q: 'How much does delivery cost?',
          a: 'Delivery costs vary based on your location and order value. Orders above UGX 500,000 qualify for free delivery within Kampala. For other areas, delivery fees are calculated at checkout.'
        },
        {
          q: 'How long does delivery take?',
          a: 'Kampala deliveries: 1-2 business days. Other urban areas: 2-4 business days. Remote areas: 3-7 business days.'
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! You\'ll receive a tracking link via email and SMS once your order is dispatched. You can also check your order status by logging into your account.'
        }
      ]
    },
    {
      category: 'Products & Stock',
      questions: [
        {
          q: 'Are all products brand new?',
          a: 'We sell both brand new and certified used products. Each product listing clearly indicates its condition. All used items are thoroughly tested and certified.'
        },
        {
          q: 'Do products come with warranty?',
          a: 'Yes! New products come with manufacturer warranties ranging from 6 months to 2 years depending on the brand. Used products come with a 30-day UgaBuy warranty.'
        },
        {
          q: 'What if a product is out of stock?',
          a: 'Out-of-stock items are clearly marked on the website. You can contact us at +256 753 645 800 to inquire about restocking dates or similar alternatives.'
        },
        {
          q: 'Can I request a specific product not listed on your website?',
          a: 'Yes! Contact us with your requirements, and we\'ll do our best to source it for you. Special orders may take 1-2 weeks depending on availability.'
        }
      ]
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 7-day return policy for unused products in original packaging. Items must be in the same condition as received. See our Return Policy page for full details.'
        },
        {
          q: 'How long do refunds take?',
          a: 'Once we receive and approve your return, refunds are processed within 5-7 business days. Mobile Money refunds: 1-2 days. Card refunds: 5-10 days depending on your bank.'
        },
        {
          q: 'What if I receive a defective product?',
          a: 'Contact us within 48 hours of delivery with photos of the defect. We\'ll arrange free pickup and send you a replacement immediately at no extra cost.'
        },
        {
          q: 'Can I exchange a product for a different model?',
          a: 'Yes! Follow our return process and place a new order for the item you want. This ensures faster processing than direct exchanges.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          q: 'Do I need an account to make a purchase?',
          a: 'Yes, creating an account helps us process your order, track deliveries, and provide better customer service. It only takes a minute to sign up!'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Absolutely! We use Stripe, a PCI-DSS compliant payment processor with bank-level encryption. We never store your card details on our servers.'
        },
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click "Forgot Password" on the login page, and we\'ll send you a reset link via email. If you don\'t receive it, check your spam folder or contact us.'
        },
        {
          q: 'Can I update my delivery address after ordering?',
          a: 'You can update your address within 2 hours of placing the order. Contact us immediately at +256 753 645 800 or via WhatsApp.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          q: 'Do you provide setup assistance?',
          a: 'While we don\'t offer in-person setup services, our customer support team can guide you through basic setup via phone or WhatsApp. Manufacturer support is also available for most products.'
        },
        {
          q: 'What if my product stops working after the warranty period?',
          a: 'We can recommend trusted repair centers in Uganda or help you contact the manufacturer. We also offer paid repair coordination services.'
        },
        {
          q: 'Do you sell accessories separately?',
          a: 'Yes! We have a wide range of accessories including chargers, cases, screen protectors, cables, and more. Browse our Accessories category.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="faq-page">
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Find answers to common questions about shopping with UgaBuy
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqs.map((category, catIndex) => (
          <div key={catIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((faq, qIndex) => {
                const index = `${catIndex}-${qIndex}`;
                const isOpen = openIndex === index;
                return (
                  <div key={qIndex} className="border border-border rounded-lg">
                    <button
                      onClick={() => toggleFAQ(catIndex, qIndex)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"
                      data-testid={`faq-question-${index}`}
                    >
                      <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-muted-foreground" data-testid={`faq-answer-${index}`}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-accent rounded-lg p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/256753645800"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:kaluleismaelimac@gmail.com"
              className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;