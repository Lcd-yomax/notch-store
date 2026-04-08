import { supabase } from '@/lib/supabase/client';
import CategoryPageClient from '@/components/CategoryPageClient';

// Enable ISR (revalidate every hour)
export const revalidate = 3600;

export default async function CategoryDetails({ params }: { params: Promise<{ id: string }> }) {
  // Await params as required in Next 15+
  const unwrappedParams = await params;
  const id = decodeURIComponent(unwrappedParams.id);
  
  // Fetch data concurrently on server side
  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase
      .from('products')
      .select(`
        *,
        categories!inner(id, name, slug),
        variations:product_variations(*),
        images:product_images(*)
      `)
      .eq('is_active', true)
      .eq('categories.slug', id)
  ]);

  const catData = categoriesRes.data || [];
  const prodData = productsRes.data || [];

  const matchedCategory = catData.find((c: any) => c.slug === id);
  const categoryName = matchedCategory 
    ? matchedCategory.name 
    : id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return <CategoryPageClient categoryName={categoryName} initialProducts={prodData} />;
}
