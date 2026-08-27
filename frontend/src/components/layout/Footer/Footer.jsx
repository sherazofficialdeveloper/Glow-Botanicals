// components/layout/Footer/Footer.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter,
  Check,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  Shield,
  Truck,
  RefreshCw,
} from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/products' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Blog', path: '/blog' },
  ];

  const helpLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  ];

 

  return (
    <footer className="bg-[#fff7fa] text-gray-800 border-t border-rose-200">
      
      

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <img
              src="/logo.png"
              alt="Glowly Botanical"
              className="h-32 w-auto object-contain"
              onError={(e) => {
                e.target.src = '/images/logo-placeholder.png';
              }}
            />
            <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed max-w-sm">
              To create high-quality, plant-based botanical skincare products that are safe, 
              gentle, and effective for people and the planet.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-rose-200 text-[#d9006c] flex items-center justify-center hover:bg-[#d9006c] hover:text-white transition-colors shadow-sm"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-rose-200 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="hover:text-[#d9006c] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-rose-200 pb-2">
              Help & Info
            </h4>
            <ul className="space-y-2 text-xs font-medium text-gray-600">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.path}
                    className="hover:text-[#d9006c] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-rose-200 pb-2">
              Sign Up & Save 15%
            </h4>
            <p className="text-xs text-gray-600 font-medium">
              Get an exclusive 15% discount on your first Glowly Botanical order.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Subscribed! Check your inbox for code GLOW15.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#d9006c] transition-colors pr-10"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#d9006c] text-white py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-[#a80052] transition-colors shadow-sm"
                >
                  Subscribe Now
                </button>
              </form>
            )}

            <p className="text-[10px] text-gray-400">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-rose-200/80 bg-rose-100/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <p className="font-semibold text-center sm:text-left">
            © {new Date().getFullYear()} Glowly Botanical. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium text-gray-500">
            <Link href="/privacy-policy" className="hover:text-[#d9006c] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/terms" className="hover:text-[#d9006c] transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/contact" className="hover:text-[#d9006c] transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>3-Minute Glow Guarantee</span>
          </div>
        </div>
      </div>

    </footer>
  );
};