// src/app/sitemap.js
import { productService } from '@/services/productService';
import { blogService } from '@/services/blogService';

export default async function sitemap() {
  const baseUrl = 'https://Glow botanical.com';

  // Static routes
  const staticRoutes = [
    '',
    '/home',
    '/products',
    '/categories',
    '/about',
    '/contact',
    '/faq',
    '/blog',
    '/privacy-policy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Product routes
  let productRoutes = [];
  try {
    const products = await productService.getProducts({ limit: 100 });
    productRoutes = products.items.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  // Blog routes
  let blogRoutes = [];
  try {
    const posts = await blogService.getPosts({ limit: 100 });
    blogRoutes = posts.items.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Failed to fetch blog posts for sitemap:', error);
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}