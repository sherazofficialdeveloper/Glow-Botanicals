// frontend/src/components/sections/BeforeAfterSlider.jsx
'use client';

import { useState, useEffect } from 'react';

export const BeforeAfterSlider = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - will be replaced with API call
  const mockData = [
    {
      id: 1,
      before: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&sat=-65&con=120',
      after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
      description: 'From dry and patchy to deeply nourished, soft, and hydrated skin',
    },
    {
      id: 2,
      before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&sat=-60&con=115',
      after: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      description: 'Turn dull, uneven tone into a radiant, glowing complexion',
    },
    {
      id: 3,
      before: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&sat=-55&con=115',
      after: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      description: 'Transform open pores into a smooth, flawless finish',
    },
  ];

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual API endpoint
        // const response = await fetch('/api/before-after');
        // const data = await response.json();
        // setCases(data);
        
        // Using mock data for now
        setCases(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching before/after data:', error);
        setCases(mockData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-6 md:py-10 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto mt-2"></div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden border border-rose-100">
                <div className="aspect-[16/10] w-full bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-10 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            See the difference from the very first use,{' '}
            <span className="text-[#d9006c]">soft, smooth, radiant skin.</span>
          </h2>
          <p className="text-gray-600 text-sm mt-1">You'll love it.</p>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex flex-nowrap gap-3 sm:gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {cases.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[46vw] sm:w-[300px] md:w-[340px] lg:w-[360px] bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-[16/10] w-full bg-gray-100 grid grid-cols-2 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.before} 
                    alt="Before" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-[10px] tracking-wider bg-black/40 px-3 py-0.5 rounded-full">
                    Before
                  </span>
                </div>
                <div className="relative overflow-hidden">
                  <img 
                    src={item.after} 
                    alt="After" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-[10px] tracking-wider bg-[#d9006c]/80 px-3 py-0.5 rounded-full">
                    After
                  </span>
                </div>
              </div>
              <div className="p-3 text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-700 leading-snug">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-[#d9006c] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#a80052] transition-all shadow-md hover:shadow-lg"
          >
            Start Your Glow Journey
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </section>
  );
};