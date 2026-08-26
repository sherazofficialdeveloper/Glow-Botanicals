// app/(shop)/faq/page.jsx
'use client';

import { HelpCircle } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { FAQSection } from '@/components/sections/FAQSection';
import { useFAQ } from '@/hooks/useFAQ';

export default function FAQPage() {
  const { faqs, loading, error } = useFAQ();

  return (
    <>
      <div className="bg-rose-50/50 border-b border-rose-100">
        <Container className="py-10 sm:py-14 text-center">
          <div className="inline-flex items-center space-x-2 bg-white border border-rose-200 text-[#d9006c] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <HelpCircle className="w-4 h-4 text-[#d9006c]" />
            <span>Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
            Everything you need to know about our products, shipping, and guarantee. Can&apos;t find your answer? Reach out on our contact page.
          </p>
        </Container>
      </div>

      {error ? (
        <Container className="py-16 text-center">
          <p className="text-red-600 font-medium mb-2">Unable to load FAQs right now.</p>
          <p className="text-sm text-gray-500">Please refresh the page or try again in a moment.</p>
        </Container>
      ) : (
        <FAQSection faqs={faqs} loading={loading} />
      )}
    </>
  );
}
