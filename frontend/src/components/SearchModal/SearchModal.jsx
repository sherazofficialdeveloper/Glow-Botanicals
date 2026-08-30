// components/SearchModal/SearchModal.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  ShoppingBag, 
  ArrowRight, 
  Clock, 
  TrendingUp,
  Sparkles,
  Loader,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useDebounce } from '@/hooks/useDebounce';
import { productService } from '@/services/productService';

export const SearchModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([
    'Batana Oil',
    'Kojic Acid Serum',
    'Papaya Lotion',
    'Glow Set',
    'Hair Growth Oil',
  ]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Search products
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.searchProducts(debouncedQuery, 10);
        setResults(data || []);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < (results.length + (query.trim() ? 0 : recentSearches.length) - 1) 
            ? prev + 1 
            : prev
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      }

      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const totalItems = query.trim() ? results.length : recentSearches.length;
        if (selectedIndex < totalItems) {
          const item = query.trim() ? results[selectedIndex] : recentSearches[selectedIndex];
          if (item) {
            if (typeof item === 'string') {
              handleSearch(item);
            } else {
              handleSelectProduct(item);
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, recentSearches, query, selectedIndex]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const handleSearch = (term) => {
    if (!term.trim()) return;
    saveRecentSearch(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const handleSelectProduct = (product) => {
    saveRecentSearch(product.name);
    router.push(`/products/${product.slug}`);
    onClose();
  };

  const handleRemoveRecent = (term, e) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Handle click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const hasResults = results.length > 0;
  const hasRecentSearches = recentSearches.length > 0;
  const showRecent = !query.trim() && hasRecentSearches;
  const showTrending = !query.trim() && !hasRecentSearches;
  const showResults = query.trim() && (hasResults || loading);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-12 lg:pt-20 p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-rose-100 max-h-[90vh] flex flex-col">
        
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 bg-rose-50/50 border-b border-rose-100">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#d9006c] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for? (e.g. Batana, Serum, Kojic)..."
              className="w-full bg-transparent text-sm sm:text-base font-bold text-gray-900 focus:outline-none placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-sm placeholder:font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-full hover:bg-rose-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-rose-200 text-gray-500 hover:text-gray-900 flex items-center justify-center shrink-0 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results / Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-[#d9006c] animate-spin" />
              <p className="text-sm text-gray-500 mt-3">Searching products...</p>
            </div>
          )}

          {/* Results */}
          {!loading && hasResults && (
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
              </p>
              <div className="space-y-2">
                {results.map((product, index) => {
                  const isSelected = selectedIndex === index;
                  const imageUrl = product.images?.[0] || '/images/placeholder.png';

                  return (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product)}
                      className={`
                        flex items-center space-x-4 p-3 rounded-2xl cursor-pointer
                        transition-all duration-150
                        ${isSelected 
                          ? 'bg-rose-50 border border-rose-200' 
                          : 'border border-transparent hover:bg-rose-50 hover:border-rose-100'
                        }
                      `}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl bg-white p-1 border border-rose-100 shrink-0"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.png';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#d9006c] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {product.subtitle || product.category?.name || ''}
                        </p>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs font-extrabold text-[#d9006c]">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                          {product.inStock === false && (
                            <span className="text-[10px] text-red-600 font-bold">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors
                        ${isSelected 
                          ? 'bg-[#d9006c] text-white' 
                          : 'bg-white border border-rose-200 text-[#d9006c] group-hover:bg-[#d9006c] group-hover:text-white'
                        }
                      `}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && query.trim() && !hasResults && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-base font-bold text-gray-900">No results found</p>
              <p className="text-sm text-gray-500 mt-1">
                We couldn't find anything matching "{query}"
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Try different keywords or browse our categories
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {showRecent && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearAllRecent}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <div
                      key={term}
                      onClick={() => handleSearch(term)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-full cursor-pointer
                        transition-all duration-150
                        ${isSelected 
                          ? 'bg-[#d9006c] text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }
                      `}
                    >
                      <Clock className="w-3 h-3" />
                      <span className="text-sm font-medium">{term}</span>
                      <button
                        onClick={(e) => handleRemoveRecent(term, e)}
                        className={`
                          p-0.5 rounded-full transition-colors
                          ${isSelected 
                            ? 'hover:bg-white/20 text-white' 
                            : 'hover:bg-gray-300 text-gray-400'
                          }
                        `}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {showTrending && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-[#d9006c]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Trending Now
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-rose-50 text-[#d9006c] rounded-full text-sm font-medium hover:bg-rose-100 transition-colors flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories */}
          {!query.trim() && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Browse Categories
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Oils', 'Serums', 'Lotions', 'Washes', 'Sets', 'Bundles'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      router.push(`/products?category=${cat.toLowerCase()}`);
                      onClose();
                    }}
                    className="px-3 py-2 text-center text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-rose-50 hover:text-[#d9006c] transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Help Text */}
        <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gray-50/50 rounded-b-3xl">
          <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">Esc</kbd> to close</span>
              <span>Use <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">↓</kbd> to navigate</span>
            </div>
            <span className="text-[#d9006c] font-semibold">✨ Glow  Botanical</span>
          </div>
        </div>

      </div>
    </div>
  );
};