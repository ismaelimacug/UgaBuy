import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0e14] text-white mt-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="https://customer-assets.emergentagent.com/job_techstore-ug/artifacts/kju79vt4_ugabuy%20logo.jpg" 
                alt="UgaBuy Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm">
              Uganda's premier marketplace for quality tech gadgets at unbeatable prices.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors" data-testid="footer-about">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary transition-colors" data-testid="footer-contact">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-primary transition-colors" data-testid="footer-faq">FAQ</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-primary transition-colors">Shop Now</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-300 hover:text-primary transition-colors" data-testid="footer-terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-primary transition-colors" data-testid="footer-privacy">Privacy Policy</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-primary transition-colors" data-testid="footer-returns">Return Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                Kampala, Uganda
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <a href="tel:+256753645800" className="hover:text-primary transition-colors">+256 753 645 800</a>
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <a href="mailto:kaluleismaelimac@gmail.com" className="hover:text-primary transition-colors">kaluleismaelimac@gmail.com</a>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com/UgaBuyy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://wa.me/256753645800" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors" data-testid="social-whatsapp">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@.ugabuy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors" data-testid="social-tiktok">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a href="https://snapchat.com/ugabuy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-primary transition-colors" data-testid="social-snapchat">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03a.875.875 0 01-.304-.06c-.074-.03-.24-.105-.539-.135-.177-.016-.371-.016-.58-.016-.516 0-1.063.105-1.639.3-.972.329-1.961.664-3.146.664-1.184 0-2.174-.335-3.145-.664-.584-.195-1.123-.3-1.64-.3-.209 0-.403 0-.58.016-.298.029-.465.104-.539.135a.843.843 0 01-.303.06h-.03c-.285 0-.479-.134-.555-.405a4.24 4.24 0 01-.134-.553c-.045-.195-.105-.479-.164-.57-1.873-.283-2.907-.702-3.146-1.271a.554.554 0 01-.045-.225c-.015-.24.165-.465.42-.509 3.265-.539 4.731-3.879 4.791-4.014l.016-.015c.18-.345.209-.645.119-.869-.195-.434-.884-.658-1.332-.809-.135-.045-.256-.09-.346-.119-.823-.33-1.227-.72-1.212-1.168 0-.36.284-.69.734-.839.15-.06.327-.09.51-.09.12 0 .298.015.463.105.375.18.734.285 1.033.3.198 0 .326-.044.401-.089a27.688 27.688 0 01-.03-.51l-.002-.06c-.105-1.628-.23-3.654.298-4.847 1.583-3.546 4.94-3.821 5.931-3.821z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} UgaBuy. All rights reserved.</p>
          <p className="mt-2">Mon-Sat: 8:00 AM - 8:00 PM | Sun: 10:00 AM - 6:00 PM</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;