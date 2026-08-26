// frontend/src/components/product/ProductSort.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export const ProductSort = ({ className = '' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSort = searchParams?.get('sort') || 'newest';

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  const handleSort = (sortId) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('sort', sortId);
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const currentLabel = sortOptions.find(opt => opt.id === currentSort)?.label || 'Sort By';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{currentLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSort(option.id)}
                className={`
                  w-full px-4 py-2.5 text-sm text-left transition-colors
                  ${currentSort === option.id 
                    ? 'text-[#d9006c] font-bold bg-rose-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {option.label}
                {currentSort === option.id && (
                  <span className="float-right">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};