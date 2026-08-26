
// frontend/src/components/sections/ShoppableReels.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Instagram,
  X,
  ShoppingBag,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const ShoppableReels = ({
  reels = [],
  products = [],
  onAddToCart,
  loading = false,
}) => {
  const [activeReel, setActiveReel] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const modalVideoRef = useRef(null);

  /*
   * ---------------------------------------------------------
   * Find product attached to reel
   * ---------------------------------------------------------
   */
  const getProductForReel = (reel) => {
    if (reel?.productId && products.length > 0) {
      const found = products.find(
        (product) =>
          String(product._id) === String(reel.productId)
      );

      if (found) {
        return found;
      }
    }

    return products.length > 0 ? products[0] : null;
  };

  /*
   * ---------------------------------------------------------
   * Format price
   * ---------------------------------------------------------
   */
  const formatPrice = (price) => {
    if (!price) {
      return 'Rs 1,999.00';
    }

    return `Rs ${Math.round(price * 100).toLocaleString()}.00`;
  };

  /*
   * ---------------------------------------------------------
   * Reset modal video state
   * ---------------------------------------------------------
   */
  useEffect(() => {
    setIsMuted(true);
    setIsVideoReady(false);
    setIsPlaying(false);
  }, [activeReel]);

  /*
   * ---------------------------------------------------------
   * Modal video autoplay
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!activeReel) return;

    let timer;
    let attempts = 0;

    const playModalVideo = () => {
      const video = modalVideoRef.current;

      if (!video) {
        if (attempts < 20) {
          attempts += 1;
          timer = setTimeout(playModalVideo, 100);
        }

        return;
      }

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsVideoReady(true);
        })
        .catch((error) => {
          console.log('Modal autoplay blocked:', error);
          setIsPlaying(false);
        });
    };

    timer = setTimeout(playModalVideo, 100);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [activeReel]);

  /*
   * ---------------------------------------------------------
   * Modal video can play
   * ---------------------------------------------------------
   */
  const handleModalCanPlay = (event) => {
    const video = event.currentTarget;

    setIsVideoReady(true);

    video.muted = true;

    video
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.log('Modal canPlay autoplay blocked:', error);
        setIsPlaying(false);
      });
  };

  /*
   * ---------------------------------------------------------
   * Modal video playing
   * ---------------------------------------------------------
   */
  const handleModalPlaying = () => {
    setIsPlaying(true);
    setIsVideoReady(true);
  };

  /*
   * ---------------------------------------------------------
   * Modal video paused
   * ---------------------------------------------------------
   */
  const handleModalPause = () => {
    setIsPlaying(false);
  };

  /*
   * ---------------------------------------------------------
   * Manual modal play
   * ---------------------------------------------------------
   */
  const handleVideoClick = async () => {
    const video = modalVideoRef.current;

    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
        setIsVideoReady(true);
      }
    } catch (error) {
      console.log('Manual play failed:', error);
    }
  };

  /*
   * ---------------------------------------------------------
   * Toggle modal mute
   * ---------------------------------------------------------
   */
  const toggleMute = (event) => {
    event.stopPropagation();

    const video = modalVideoRef.current;

    if (!video) return;

    const nextMuted = !video.muted;

    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  /*
   * ---------------------------------------------------------
   * Close modal
   * ---------------------------------------------------------
   */
  const closeModal = () => {
    const video = modalVideoRef.current;

    if (video) {
      video.pause();
    }

    setActiveReel(null);
    setIsVideoReady(false);
    setIsPlaying(false);
    setIsMuted(true);
  };

  /*
   * ---------------------------------------------------------
   * Escape key
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!activeReel) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeReel]);

  /*
   * ---------------------------------------------------------
   * Lock background scroll while modal is open
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!activeReel) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeReel]);

  /*
   * ---------------------------------------------------------
   * Loading state
   * ---------------------------------------------------------
   */
  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-4 border-[#d9006c] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  /*
   * ---------------------------------------------------------
   * No reels
   * ---------------------------------------------------------
   */
  if (!reels || reels.length === 0) {
    return null;
  }

  /*
   * ---------------------------------------------------------
   * Reel Card
   *
   * IMPORTANT:
   * The video itself is now rendered on the homepage.
   * It does NOT require the user to click the card.
   * ---------------------------------------------------------
   */
  const ReelCard = ({ reel, mobile = false }) => {
    const product = getProductForReel(reel);
    const cardVideoRef = useRef(null);

    const discountPercent = 19;

    const formattedPrice = formatPrice(product?.price);

    const formattedOldPrice = formatPrice(
      product?.originalPrice ||
        (product?.price ? product.price * 1.3 : null)
    );

    /*
     * -------------------------------------------------------
     * Card video autoplay
     * -------------------------------------------------------
     */
    useEffect(() => {
      const video = cardVideoRef.current;

      if (!video) return;

      let timer;
      let attempts = 0;

      const playVideo = () => {
        const currentVideo = cardVideoRef.current;

        if (!currentVideo) return;

        currentVideo.muted = true;
        currentVideo.defaultMuted = true;
        currentVideo.playsInline = true;

        currentVideo
          .play()
          .catch((error) => {
            console.log(
              'Reel card autoplay attempt failed:',
              error
            );

            /*
             * Retry a few times because the video may not
             * have enough data immediately after rendering.
             */
            if (attempts < 15) {
              attempts += 1;
              timer = setTimeout(playVideo, 300);
            }
          });
      };

      /*
       * Start shortly after the video element mounts.
       */
      timer = setTimeout(playVideo, 100);

      /*
       * Also try when enough video data is available.
       */
      const handleCanPlay = () => {
        const currentVideo = cardVideoRef.current;

        if (!currentVideo) return;

        currentVideo.muted = true;

        currentVideo
          .play()
          .catch(() => {});
      };

      video.addEventListener(
        'canplay',
        handleCanPlay
      );

      return () => {
        clearTimeout(timer);

        video.removeEventListener(
          'canplay',
          handleCanPlay
        );

        video.pause();
      };
    }, [reel._id, reel.url, reel.videoUrl]);

    const videoUrl = reel.url || reel.videoUrl;

    return (
      <div
        key={reel._id}
        onClick={() => setActiveReel(reel)}
        className={
          mobile
            ? 'flex-shrink-0 w-[200px] bg-white rounded-xl border border-gray-300/90 shadow-sm hover:shadow-lg hover:border-gray-400 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer'
            : 'bg-white rounded-xl border border-gray-300/90 shadow-sm hover:shadow-lg hover:border-gray-400 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer'
        }
      >
        <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-gray-100">

          {/* Discount */}
          <div className="absolute top-0 left-0 z-20 bg-[#bd002a] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-br-md shadow-xs">
            {discountPercent}% OFF
          </div>

          {/* ------------------------------------------------
              Actual Reel Video
              
              Thumbnail is ONLY used as poster when uploaded.
              If no thumbnail exists, there is NO placeholder.
              ------------------------------------------------ */}
          {videoUrl ? (
            <video
              ref={cardVideoRef}
              src={videoUrl}
              {...(reel.thumbnail
                ? { poster: reel.thumbnail }
                : {})}
              muted
              autoPlay
              playsInline
              loop
              preload="auto"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : reel.thumbnail ? (
            /*
             * If there is no video URL but thumbnail exists,
             * show the uploaded thumbnail.
             */
            <img
              src={reel.thumbnail}
              alt={
                reel.title ||
                'Instagram Reel'
              }
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            /*
             * No video and no thumbnail:
             * intentionally show nothing/blank background.
             */
            <div className="w-full h-full bg-gray-100" />
          )}

          {/* Play Icon */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white/90 text-[#d9006c] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>

          {/* Product Image */}
          {product && (
            <div className="absolute bottom-2 left-2 z-20 bg-white/95 border border-gray-200 rounded-md p-0.5 shadow-xs w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center overflow-hidden">
              <img
                src={
                  product.images?.[0] ||
                  '/images/placeholder.png'
                }
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3 bg-white border-t border-gray-200/80 flex flex-col space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#d9006c] transition-colors">
            {product?.name || 'Glowly Product'}
          </h4>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-extrabold text-[#bd002a]">
              {formattedPrice}
            </span>

            <span className="text-gray-400 line-through text-[11px] font-medium">
              {formattedOldPrice}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="instagram-reels"
      className="py-12 sm:py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-2 bg-rose-50 text-[#d9006c] px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 border border-rose-100">
            <Instagram className="w-3.5 h-3.5 text-[#d9006c]" />
            <span>@GlowlyAngel</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
            Follow On Instagram
          </h2>
        </div>

        {/* ------------------------------------------------
            Desktop - 5 Column Grid
            ------------------------------------------------ */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {reels.slice(0, 5).map((reel) => (
            <ReelCard
              key={reel._id}
              reel={reel}
            />
          ))}
        </div>

        {/* ------------------------------------------------
            Mobile - Horizontal Scroll
            ------------------------------------------------ */}
        <div className="sm:hidden flex flex-nowrap gap-3 overflow-x-auto pb-4 hide-scrollbar">
          {reels.slice(0, 5).map((reel) => (
            <ReelCard
              key={reel._id}
              reel={reel}
              mobile
            />
          ))}
        </div>
      </div>

      {/* ------------------------------------------------
          Reel Modal
          ------------------------------------------------ */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-200">

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Close reel"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Player */}
            <div
              className="relative aspect-[9/16] w-full bg-black cursor-pointer"
              onClick={handleVideoClick}
            >
              <video
                key={activeReel._id}
                ref={modalVideoRef}
                src={
                  activeReel.url ||
                  activeReel.videoUrl
                }
                {...(activeReel.thumbnail
                  ? {
                      poster:
                        activeReel.thumbnail,
                    }
                  : {})}
                muted={isMuted}
                autoPlay
                playsInline
                loop
                preload="auto"
                className="w-full h-full object-cover"
                onCanPlay={handleModalCanPlay}
                onPlaying={handleModalPlaying}
                onPause={handleModalPause}
              />

              {/* Play Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-white/90 text-[#d9006c] flex items-center justify-center shadow-xl">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                className="absolute bottom-20 right-3 z-20 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label={
                  isMuted
                    ? 'Unmute video'
                    : 'Mute video'
                }
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              {/* Overlay Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                <p className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                  {activeReel.handle ||
                    '@glowlyangel'}
                </p>

                <h3 className="text-sm font-extrabold mt-0.5">
                  {activeReel.title}
                </h3>
              </div>
            </div>

            {/* Product CTA */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">

              <div>
                <p className="text-xs font-extrabold text-gray-900 truncate max-w-[170px]">
                  {getProductForReel(
                    activeReel
                  )?.name ||
                    'Glowly Product'}
                </p>

                <span className="text-sm font-extrabold text-[#bd002a]">
                  {formatPrice(
                    getProductForReel(
                      activeReel
                    )?.price
                  )}
                </span>
              </div>

              <button
                onClick={() => {
                  const product =
                    getProductForReel(
                      activeReel
                    );

                  if (
                    product &&
                    onAddToCart
                  ) {
                    onAddToCart(product);
                  }

                  closeModal();
                }}
                className="bg-[#d9006c] text-white px-4 py-2 rounded-full font-extrabold text-xs uppercase tracking-wider hover:bg-[#a80052] transition-colors flex items-center space-x-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};
