// frontend/src/hooks/useFAQ.js
'use client';

import { useState, useEffect } from 'react';
import { faqService } from '@/services/faqService';

export const useFAQ = (options = {}) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await faqService.getFAQs(options);
        setFaqs(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch FAQs');
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, [JSON.stringify(options)]);

  return { faqs, loading, error };
};

export default useFAQ;