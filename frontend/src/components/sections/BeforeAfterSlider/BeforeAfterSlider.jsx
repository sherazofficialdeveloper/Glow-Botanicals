// frontend/src/components/sections/BeforeAfterSlider.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';

export const BeforeAfterSlider = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/before-after');
        setCases(response.data.data.items || []);
      } catch (error) {
        console.error('Error fetching before/after data:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /*
   * ---------------------------------------------------------
   * Mouse + Touch Drag Scroll
   * ---------------------------------------------------------
   */

  const handlePointerDown = (event) => {
    const slider = sliderRef.current;

    if (!slider) return;

    isDragging.current = true;
    hasDragged.current = false;

    startX.current = event.clientX;
    startScrollLeft.current = slider.scrollLeft;

    slider.classList.add('cursor-grabbing');
  };

  const handlePointerMove = (event) => {
    const slider = sliderRef.current;

    if (!slider || !isDragging.current) return;

    const distance = event.clientX - startX.current;

    /*
     * Only consider it a drag after a small movement.
     * This prevents normal clicks from being treated as drags.
     */
    if (Math.abs(distance) > 5) {
      hasDragged.current = true;
    }

    slider.scrollLeft =
      startScrollLeft.current - distance;
  };

  const handlePointerUp = () => {
    const slider = sliderRef.current;

    isDragging.current = false;

    if (slider) {
      slider.classList.remove('cursor-grabbing');
    }
  };

  const handlePointerLeave = () => {
    const slider = sliderRef.current;

    if (!isDragging.current) return;

    isDragging.current = false;

    if (slider) {
      slider.classList.remove('cursor-grabbing');
    }
  };

  /*
   * ---------------------------------------------------------
   * Prevent accidental image dragging
   * ---------------------------------------------------------
   */

  const handleDragStart = (event) => {
    event.preventDefault();
  };

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
              <div
                key={i}
                className="flex-shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden border border-rose-100"
              >
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

  if (!cases.length) {
    return null;
  }

  return (
    <section className="py-6 md:py-10 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            See the difference from the very first use,{' '}
            <span className="text-[#d9006c]">
              soft, smooth, radiant skin.
            </span>
          </h2>

          <p className="text-gray-600 text-sm mt-1">
            You'll love it.
          </p>
        </div>

        {/* 
          -------------------------------------------------------
          Horizontal Scroll Container

          Desktop:
          Mouse click + hold + drag

          Mobile:
          Finger touch + swipe

          -------------------------------------------------------
        */}
        <div
          ref={sliderRef}
          className="
            flex
            flex-nowrap
            gap-3
            sm:gap-4
            overflow-x-auto
            pb-4
            hide-scrollbar
            cursor-grab
            select-none
            touch-pan-x
          "
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          {cases.map((item) => (
            <div
              key={item._id}
              className="
                flex-shrink-0
                w-[46vw]
                sm:w-[300px]
                md:w-[340px]
                lg:w-[360px]
                bg-white
                rounded-2xl
                overflow-hidden
                border
                border-rose-100
                shadow-sm
                hover:shadow-lg
                transition-shadow
              "
            >
              {/* Before / After Images */}
              <div className="relative aspect-[16/10] w-full bg-gray-100 grid grid-cols-2 overflow-hidden">

                {/* Before */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.beforeImage}
                    alt="Before"
                    className="
                      w-full
                      h-full
                      object-cover
                      hover:scale-105
                      transition-transform
                      duration-500
                      pointer-events-none
                    "
                    loading="lazy"
                    draggable="false"
                    onDragStart={handleDragStart}
                  />

                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-[10px] tracking-wider bg-black/40 px-3 py-0.5 rounded-full">
                    Before
                  </span>
                </div>

                {/* After */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.afterImage}
                    alt="After"
                    className="
                      w-full
                      h-full
                      object-cover
                      hover:scale-105
                      transition-transform
                      duration-500
                      pointer-events-none
                    "
                    loading="lazy"
                    draggable="false"
                    onDragStart={handleDragStart}
                  />

                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-[10px] tracking-wider bg-[#d9006c]/80 px-3 py-0.5 rounded-full">
                    After
                  </span>
                </div>

              </div>

              {/* Description */}
              <div className="p-3 text-center">
                <p className="text-xs sm:text-sm font-medium text-gray-700 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-6">
          <a
            href="/products"
            className="
              inline-flex
              items-center
              gap-2
              bg-[#d9006c]
              text-white
              px-6
              py-3
              rounded-full
              font-bold
              text-sm
              hover:bg-[#a80052]
              transition-all
              shadow-md
              hover:shadow-lg
            "
          >
            Start Your Glow Journey

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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

        .cursor-grab {
          cursor: grab;
        }

        .cursor-grabbing {
          cursor: grabbing !important;
        }

        .select-none {
          user-select: none;
          -webkit-user-select: none;
        }

        .touch-pan-x {
          touch-action: pan-x;
        }
      `}</style>
    </section>
  );
};