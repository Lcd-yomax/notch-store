import { supabase } from '@/lib/supabase/client';
import HomePageClient from '@/components/HomePageClient';

export const revalidate = 300;

export default async function Home() {
  const [featuredRes, bestSellersRes, latestPromosRes, reviewsRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, thumbnail_url, variations:product_variations(id, price, price_display)')
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(5),
    supabase
      .from('products')
      .select('id, name, slug, thumbnail_url, variations:product_variations(id, price, price_display)')
      .eq('is_active', true)
      .eq('is_best_seller', true)
      .limit(4),
    supabase
      .from('products')
      .select('id, name, slug, thumbnail_url, variations:product_variations(id, price, price_display)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('reviews')
      .select('id, full_name, stars, comment, products(name)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  return (
    <HomePageClient
      featuredProducts={featuredRes.data ?? []}
      bestSellerProducts={bestSellersRes.data ?? []}
      latestPromos={latestPromosRes.data ?? []}
      reviewsData={reviewsRes.data ?? []}
    />
  );
}
