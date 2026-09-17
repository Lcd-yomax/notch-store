import { supabasePublic as supabase } from '@/lib/supabase/public';
import HomePageClient from '@/components/HomePageClient';
import { CARD_FIELDS } from '@/lib/catalog/queries';
import type { CardProduct } from '@/lib/catalog/types';

export const revalidate = 300;

export default async function Home() {
  const [featuredRes, bestSellersRes, latestPromosRes, reviewsRes] = await Promise.all([
    supabase
      .from('products')
      .select(`${CARD_FIELDS}, reviews(stars)`)
      .eq('reviews.is_approved', true)
      .eq('is_active', true)
      .eq('is_featured', true)
      .limit(5),
    supabase
      .from('products')
      .select(`${CARD_FIELDS}, reviews(stars)`)
      .eq('reviews.is_approved', true)
      .eq('is_active', true)
      .eq('is_best_seller', true)
      .limit(4),
    supabase
      .from('products')
      .select(`${CARD_FIELDS}, reviews(stars)`)
      .eq('reviews.is_approved', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(16),
    supabase
      .from('reviews')
      .select('id, full_name, stars, comment, products(name)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  return (
    <HomePageClient
      featuredProducts={(featuredRes.data ?? []) as unknown as CardProduct[]}
      bestSellerProducts={(bestSellersRes.data ?? []) as unknown as CardProduct[]}
      latestPromos={(latestPromosRes.data ?? []) as unknown as CardProduct[]}
      reviewsData={reviewsRes.data ?? []}
    />
  );
}
