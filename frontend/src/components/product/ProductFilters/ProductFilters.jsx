// frontend/src/components/product/ProductFilters.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export const ProductFilters = ({ className = '' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams?.get('category') || '',
    minPrice: searchParams?.get('minPrice') || '',
    maxPrice: searchParams?.get('maxPrice') || '',
    inStock: searchParams?.get('inStock') === 'true',
  });
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (filters.category) params.set('category', filters.category);
    else params.delete('category');
    
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    else params.delete('minPrice');
    
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    else params.delete('maxPrice');
    
    if (filters.inStock) params.set('inStock', 'true');
    else params.delete('inStock');
    
    params.set('page', '1');
    
    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ''}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    });
    router.push('/products');
    setIsOpen(false);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.inStock;

  // Filter Button
  const FilterButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
    >
      <Filter className="w-4 h-4" />
      <span>Filters</span>
      {hasActiveFilters && (
        <span className="w-2 h-2 rounded-full bg-[#d9006c]"></span>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <FilterButton />

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl animate-slideIn">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Filters</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent
              filters={filters}
              categories={categories}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              updateFilter={updateFilter}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent
          filters={filters}
          categories={categories}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          updateFilter={updateFilter}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          isDesktop
        />
      </div>
    </>
  );
};

// Filter Content Component
const FilterContent = ({
  filters,
  categories = [],
  expandedSections,
  toggleSection,
  updateFilter,
  applyFilters,
  clearFilters,
  hasActiveFilters,
  isDesktop = false,
}) => {
  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <div className={isDesktop ? '' : 'p-4 space-y-6 overflow-y-auto h-[calc(100%-80px)]'}>
      {/* Category Filter */}
      <div>
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-sm font-bold text-gray-900"
        >
          <span>Category</span>
          {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.category && (
          <div className="mt-2 space-y-1.5">
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.category === ''}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="rounded-full border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
              />
              <span>All Categories</span>
            </label>
            {categoryList.map((cat) => (
              <label key={cat._id} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat._id}
                  checked={filters.category === cat._id}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="rounded-full border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
                />
                <span>{cat.name}</span>
                {cat.products && <span className="text-xs text-gray-400">({cat.products})</span>}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-sm font-bold text-gray-900"
        >
          <span>Price Range</span>
          {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.price && (
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', e.target.value)}
              className="w-1/2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c]"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', e.target.value)}
              className="w-1/2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d9006c]"
            />
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div>
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full text-sm font-bold text-gray-900"
        >
          <span>Availability</span>
          {expandedSections.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {expandedSections.availability && (
          <div className="mt-2">
            <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="rounded border-gray-300 text-[#d9006c] focus:ring-[#d9006c]"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        <button
          onClick={applyFilters}
          className="flex-1 bg-[#d9006c] text-white py-2.5 rounded-lg font-bold text-sm hover:bg-[#a80052] transition-colors"
        >
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};