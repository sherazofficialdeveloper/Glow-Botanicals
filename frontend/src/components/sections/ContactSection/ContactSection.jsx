// components/sections/ContactSection/ContactSection.jsx
'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';

export const ContactSection = ({ className = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className={`py-16 lg:py-24 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          badge="Get In Touch"
          title="We'd Love to Hear From You"
          subtitle="Have questions about our products? Need help with your order? Reach out to us!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-10">
          
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
              <h4 className="font-bold text-gray-900 mb-4">Contact Information</h4>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-4 h-4 text-[#d9006c]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium text-gray-900">hello@Glow botanical.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-4 h-4 text-[#d9006c]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-gray-900">+1 (800) 555-GLOW</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4 text-[#d9006c]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      123 Beauty Lane,<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#d9006c]/10 to-[#d4af37]/10 rounded-2xl p-6 border border-rose-100">
              <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-5 h-5 text-[#d9006c]" />
                <h4 className="font-bold text-gray-900">Response Time</h4>
              </div>
              <p className="text-sm text-gray-600">
                We typically respond within <strong className="text-[#d9006c]">24 hours</strong> during business days.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-rose-100 shadow-sm">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Thank You!</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your message has been sent successfully. We'll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};