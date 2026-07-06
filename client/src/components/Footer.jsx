import { Link } from 'react-router-dom';
import { Mail, Share2 } from 'lucide-react';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Aatmanirbhar Nari',
        text: 'Empowering home-based women entrepreneurs to scale their ventures!',
        url: window.location.origin
      }).catch(err => console.log('Sharing failed', err));
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard: ' + window.location.origin);
    }
  };

  return (
    <footer className="w-full py-12 liquid-glass border-t border-black/5 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-margin-mobile md:px-margin-desktop max-w-[1140px] mx-auto">
        {/* Left Section */}
        <div className="space-y-4">
          <div className="font-headline-md text-headline-md text-primary">Aatmanirbhar Nari</div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            © 2024 Aatmanirbhar Nari. Empowering women entrepreneurs through community, technology, and support.
          </p>
          <div className="flex items-center gap-4 pt-4 text-black">
            {/* Instagram Link */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 hover:scale-110 hover:text-pink-600 transition-all flex items-center justify-center" 
              aria-label="Instagram"
            >
              <FaInstagram size={22} />
            </a>

            {/* Facebook Link */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 hover:scale-110 hover:text-blue-600 transition-all flex items-center justify-center" 
              aria-label="Facebook"
            >
              <FaFacebook size={22} />
            </a>

            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/919876543210?text=Hello%20Aatmanirbhar%20Nari%2C%20I%20want%20to%20know%20more%20about%20the%20platform!" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 hover:scale-110 hover:text-green-600 transition-all flex items-center justify-center" 
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={22} />
            </a>

            {/* Email Client Trigger */}
            <a 
              href="mailto:support@aatmanirbharnari.in?subject=Inquiry%20from%20Aatmanirbhar%20Nari%20Platform" 
              className="p-2 hover:scale-110 hover:text-red-500 transition-all flex items-center justify-center" 
              aria-label="Mail"
            >
              <Mail size={22} />
            </a>

            {/* Native Web Share Button */}
            <button 
              onClick={handleShare}
              className="p-2 hover:scale-110 hover:text-blue-500 transition-all flex items-center justify-center cursor-pointer" 
              aria-label="Share Website"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>

        {/* Right Section - Links */}
        <div className="grid grid-cols-2 gap-8">
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg text-on-surface">Quick Links</h4>
            <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
              <Link to="/support" className="hover:text-primary underline decoration-2 transition-all">
                Support
              </Link>
              <Link to="/faq" className="hover:text-primary underline decoration-2 transition-all">
                FAQ
              </Link>
              <Link to="/contact" className="hover:text-primary underline decoration-2 transition-all">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg text-on-surface">Legal</h4>
            <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant">
              <Link to="/privacy" className="hover:text-primary underline decoration-2 transition-all">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary underline decoration-2 transition-all">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
