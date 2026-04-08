import { supabase } from '@/lib/supabase/client';
import HomePageClient from '@/components/HomePageClient';

// Revalidate this page every hour (3600 seconds)
// This enables Incremental Static Regeneration (ISR) and massive performance gains.
export const revalidate = 3600;

export default async function Home() {
  // Fetch data directly from DB on the server concurrently
  // No loading flashes, no client waterfalls!
  const [productsRes, reviewsRes] = await Promise.all([
    supabase
      .from('products')
      .select(`
        *,
        categories!inner(id, name, slug),
        variations:product_variations(*),
        images:product_images(*)
      `)
      .eq('is_active', true),
    supabase
      .from('reviews')
      .select('*, products(name)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10)
  ]);

  const productsData = productsRes.data || [];
  const reviewsData = reviewsRes.data || [];

  return <HomePageClient productsData={productsData} reviewsData={reviewsData} />;
}
