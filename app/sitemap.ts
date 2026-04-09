import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://notchmaroc.ma';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/shop',
    '/categories',
    '/politique-confidentialite',
    '/politique-expedition',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // 2. Fetch all active products
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true);

    const productRoutes = (products || []).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    // 3. Fetch all categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    const categoryRoutes = (categories || []).map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static routes if database fails
    return staticRoutes;
  }
}
