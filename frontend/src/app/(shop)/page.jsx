// frontend/src/app/(shop)/page.jsx
'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useBanners } from '@/hooks/useBanners';
import { useReels } from '@/hooks/useReels';
import { useFAQ } from '@/hooks/useFAQ';

// Section Components
import { HeroSlideshow } from '@/components/sections/HeroSlideshow';
import { BrandStoryUSP } from '@/components/sections/BrandStoryUSP';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { BeforeAfterSlider } from '@/components/sections/BeforeAfterSlider';
import { PromoBanner } from '@/components/common/PromoBanner';
import { ShoppableReels } from '@/components/sections/ShoppableReels';
import { ScrollingTicker } from '@/components/sections/ScrollingTicker';
import { LiveReviewStream } from '@/components/sections/LiveReviewStream';
import { TrustBadges } from '@/components/sections/TrustBadges';
import { FAQSection } from '@/components/sections/FAQSection';


export default function HomePage() {
  const { products, loading: productsLoading } = useFeaturedProducts(8);
  const { reviews, loading: reviewsLoading } = useReviews({ limit: 10, approved: true });
  const { banners, loading: bannersLoading } = useBanners();
  const { reels, loading: reelsLoading } = useReels();
  const { faqs, loading: faqsLoading } = useFAQ();

  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const wishlistedIds = wishlist?.map(p => p._id) || [];
  const activeBanners = banners?.filter(b => b.isActive) || [];
  const heroBanners = activeBanners.filter(b => b.type === 'hero');
  const promoBanners = activeBanners.filter(b => b.type === 'promo');

  return (
    <main>
      {/* 1. Hero Slideshow */}
      <HeroSlideshow banners={heroBanners} loading={bannersLoading} />

      {/* 2. Brand Story & USP */}
      <BrandStoryUSP />


      {/* 4. Featured Products */}
      <ProductGrid
        products={products}
        loading={productsLoading}
        onAddToCart={addItem}
        wishlistedIds={wishlistedIds}
        onToggleWishlist={toggleWishlist}
        title="Featured Collection"
        subtitle="Whitening • Brightening • Deep Hydration • Pore Tightening"
      />

      {/* 5. Before & After Slider */}
      <BeforeAfterSlider />

      {/* 6. Promo Banner 1 */}
      {promoBanners.length > 0 ? (
        <PromoBanner
          imageUrl={promoBanners[0]?.image}
          mobileImageUrl={promoBanners[0]?.mobileImage}
          altText={promoBanners[0]?.title || 'Promotional Banner'}
          link={promoBanners[0]?.link}
        />
      ) : (
        <PromoBanner
          imageUrl="/image 4.png"
          altText="Glow  Botanical Before & After Results Banner"
        />
      )}

      {/* 7. Shoppable Reels */}
      <ShoppableReels
        reels={reels}
        products={products}
        onAddToCart={addItem}
        loading={reelsLoading}
      />

      {/* 8. Promo Banner 2 */}
      {promoBanners.length > 1 ? (
        <PromoBanner
          imageUrl={promoBanners[1]?.image}
          mobileImageUrl={promoBanners[1]?.mobileImage}
          altText={promoBanners[1]?.title || 'Promotional Banner'}
          link={promoBanners[1]?.link}
        />
      ) : (
        <PromoBanner
          imageUrl="/image 5.png"
          altText="Glow  Botanical Instagram Promo Banner"
        />
      )}

      {/* 9. Scrolling Ticker */}
      <ScrollingTicker />

      {/* 10. Live Review Stream */}
      <LiveReviewStream reviews={reviews} loading={reviewsLoading} />

      {/* FAQs */}
      <FAQSection faqs={faqs} loading={faqsLoading} />
      {/* 3. Trust Badges */}
      <TrustBadges />
    </main>
  );
}