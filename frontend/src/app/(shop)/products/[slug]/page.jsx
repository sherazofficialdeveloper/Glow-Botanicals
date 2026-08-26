// app/(shop)/products/[slug]/page.jsx
'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/useProduct';
import { useRelatedProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/useToast';
import { useProductReviews } from '@/hooks/useReviews';
import { reviewService } from '@/services/reviewService';
import { ProductDetails } from '@/components/product/ProductDetails';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { ProductReviews } from '@/components/product/ProductReviews';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Container } from '@/components/common/Container';
import { Breadcrumb } from '@/components/layout/Breadcrumb';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const { product, loading: productLoading } = useProduct(slug);
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useProductReviews(product?._id);

  const { products: relatedProducts, loading: relatedLoading } = useRelatedProducts(
    product?._id,
    4
  );

  if (productLoading) {
    return (
      <Container className="min-h-[600px] flex items-center justify-center">
        <LoadingSpinner text="Loading product..." />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="min-h-[600px] flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500 mt-2">The product you're looking for doesn't exist.</p>
        <a href="/products" className="mt-4 text-[#d9006c] font-bold hover:underline">
          Browse All Products →
        </a>
      </Container>
    );
  }

  const isWishlisted = wishlist?.some(p => p._id === product._id);

  const handleAddToCart = (product, quantity = 1) => {
    addItem(product, quantity);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product._id);
  };

  const handleAddReview = async (reviewData) => {
    try {
      await reviewService.createReview({ ...reviewData, productId: product._id });
      showToast('Your review has been submitted and is awaiting approval.', 'success');
      refetchReviews();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit review', 'error');
    }
  };

  return (
    <>
      <Container>
        <Breadcrumb className="py-4" />
        
        <ProductDetails
          product={product}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
        />

        {/* Product Reviews */}
        <div className="mt-12 border-t border-gray-100 pt-12">
          <ProductReviews
            productId={product._id}
            reviews={reviews}
            loading={reviewsLoading}
            onAddReview={handleAddReview}
            averageRating={product.rating}
            totalReviews={product.reviewsCount}
          />
        </div>
      </Container>

      {/* Related Products */}
      <RelatedProducts
        products={relatedProducts}
        loading={relatedLoading}
        onAddToCart={handleAddToCart}
        wishlistedIds={wishlist?.map(p => p._id) || []}
        onToggleWishlist={toggleWishlist}
      />
    </>
  );
}