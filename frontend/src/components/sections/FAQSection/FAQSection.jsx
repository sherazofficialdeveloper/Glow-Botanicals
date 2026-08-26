// frontend/src/components/sections/FAQSection.jsx
'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

export const FAQSection = ({ faqs = [], loading = false }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = searchQuery
    ? faqs.filter(f => 
        f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-rose-50/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 lg:py-24 bg-rose-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white border border-rose-200 text-[#d9006c] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            <HelpCircle className="w-4 h-4 text-[#d9006c]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq._id || idx} className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden transition-all duration-300">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left px-6 py-4 sm:py-5 flex items-center justify-between font-bold text-sm sm:text-base text-gray-900 hover:text-[#d9006c] transition-colors"
                >
                  <span className="pr-4 flex items-center space-x-2">
                    <span className="text-[#d9006c] font-bold text-xs bg-rose-50 px-2 py-0.5 rounded-full">
                      {faq.category || 'General'}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#d9006c] text-white' : 'text-[#d9006c]'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-gray-600 font-medium leading-relaxed border-t border-rose-50 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};