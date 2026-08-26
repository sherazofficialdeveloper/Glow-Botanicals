// frontend/src/components/sections/LiveReviewStream.jsx
'use client';

import { useState } from 'react';
import { Star, CheckCircle, RefreshCw, MessageSquare, Sparkles } from 'lucide-react';

export const LiveReviewStream = ({ reviews = [], loading = false }) => {
  const [displayedCount, setDisplayedCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const visibleReviews = reviews.slice(0, displayedCount);
  const hasMore = displayedCount < reviews.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + 3, reviews.length));
      setIsLoadingMore(false);
    }, 800);
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-[#0e1412] text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews-chat" className="py-16 lg:py-24 bg-[#0e1412] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Live Social Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Girls Are Going Crazy on Insta 💖
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/70 font-medium">
            Live feedback jo Insta aur WhatsApp pe viral ho raha hai.
          </p>
        </div>

        <div className="bg-[#0b0f0e] rounded-3xl border border-emerald-900/60 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#25d366] to-[#128c7e] text-gray-950 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-emerald-200 animate-ping" />
              <span className="font-extrabold text-sm tracking-wide uppercase">Live Customer Feedback Chat</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-950 bg-white/20 px-3 py-1 rounded-full">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{reviews.length} Verified Buyers</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 max-h-[580px] overflow-y-auto bg-[#080c0b]">
            {visibleReviews.map((rev, index) => {
              const isRight = index % 2 === 1;
              const name = rev.user?.name || rev.name || 'Anonymous';
              const avatar = name.charAt(0).toUpperCase();

              return (
                <div key={rev._id} className={`flex items-start gap-3 animate-fadeIn ${isRight ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-200 border border-emerald-700/60 flex items-center justify-center font-extrabold text-xs shadow-md shrink-0">
                    {avatar}
                  </div>
                  <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed border shadow-md relative ${isRight ? 'bg-[#123127] border-emerald-800/80 text-emerald-50' : 'bg-[#0e241d] border-emerald-900/80 text-emerald-100'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-emerald-800/40">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-300 text-xs sm:text-sm">{name}</span>
                        {rev.isVerified && (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                            <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex text-[#ffd54f]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-normal text-emerald-100/90 leading-snug">"{rev.comment || rev.text}"</p>
                    <div className="mt-2 text-[10px] text-emerald-400/60 text-right font-mono">
                      {rev.createdAt || new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}

            {reviews.length === 0 && (
              <div className="text-center py-10">
                <MessageSquare className="w-8 h-8 text-emerald-800 mx-auto mb-3" />
                <p className="text-sm text-emerald-200/70 font-medium">
                  No customer reviews yet — be the first to share your experience!
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#0b0f0e] border-t border-emerald-900/60 text-center">
            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-[#25d366] text-gray-950 hover:bg-emerald-400 px-8 py-3 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /><span>Loading Reviews...</span></>
                ) : (
                  <span>Load More Customer Reviews ({reviews.length - displayedCount} remaining)</span>
                )}
              </button>
            ) : (
              <p className="text-xs text-emerald-400 font-semibold">
                ✓ Displaying all {reviews.length} verified customer reviews
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};