import { MetadataRoute } from 'next';
import { supabasePublic as supabase } from '@/lib/supabase/public';
import { SITE_URL } from '@/lib/site';

// Regenerated hourly so new products and brands show up without a rebuild
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

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
    // products has no updated_at column: selecting it made the whole query fail silently
    const [productsRes, categoriesRes, brandsRes] = await Promise.all([
      supabase.from('products').select('slug, created_at').eq('is_active', true),
      supabase.from('categories').select('slug'),
      supabase.from('brands').select('slug'),
    ]);

    const productRoutes = (productsRes.data ?? []).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    const categoryRoutes = (categoriesRes.data ?? []).map((category) => ({
      url: `${baseUrl}/categories/${encodeURIComponent(category.slug)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const brandRoutes = (brandsRes.data ?? []).map((brand) => ({
      url: `${baseUrl}/marque/${brand.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback to static routes if database fails
    return staticRoutes;
  }
}
