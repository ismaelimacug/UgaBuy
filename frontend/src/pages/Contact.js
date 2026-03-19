import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white" data-testid="contact-page">
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 text-center" data-testid="contact-title">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p className="text-muted-foreground">Kampala, Uganda</p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <a href="tel:+256753645800" className="text-primary hover:underline">+256 753 645 800</a>
            <p className="text-sm text-muted-foreground mt-2">WhatsApp available</p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <a href="mailto:kaluleismaelimac@gmail.com" className="text-primary hover:underline break-all">kaluleismaelimac@gmail.com</a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  data-testid="input-message"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                data-testid="submit-button"
              >
                {loading ? 'Sending...' : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Business Hours</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Monday - Saturday</p>
                  <p className="text-muted-foreground">8:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Sunday</p>
                  <p className="text-muted-foreground">10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-accent rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Connect</h3>
              <div className="space-y-3">
                <a
                  href="https://wa.me/256753645800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-primary text-white px-4 py-3 rounded-md hover:bg-primary/90 transition-colors text-center font-medium"
                  data-testid="whatsapp-button"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href="https://facebook.com/UgaBuyy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-secondary text-white px-4 py-3 rounded-md hover:bg-secondary/80 transition-colors text-center font-medium"
                  data-testid="facebook-button"
                >
                  Message on Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;