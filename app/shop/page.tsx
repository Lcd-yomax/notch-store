import { supabase } from '@/lib/supabase/client';
import ShopClient from '@/components/ShopClient';

export const revalidate = 60;

const ITEMS_PER_PAGE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page ?? 1));
  const categorySlug = typeof params.category === 'string' ? params.category : '';
  const sortOrder = typeof params.sort === 'string' ? params.sort : 'popular';
  const minPrice = typeof params.minPrice === 'string' ? params.minPrice : '';
  const maxPrice = typeof params.maxPrice === 'string' ? params.maxPrice : '';

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let productQuery = supabase
    .from('products')
    .select(
      `id, name, slug, thumbnail_url,
      categories!inner(id, name, slug),
      variations:product_variations(id, price, price_display, discount_label, stock)`,
      { count: 'exact' }
    )
    .eq('is_active', true)
    .range(from, to);

  if (categorySlug) {
    productQuery = productQuery.eq('categories.slug', categorySlug);
  }

  if (sortOrder === 'newest') {
    productQuery = productQuery.order('created_at', { ascending: false });
  }

  const [categoriesRes, productsRes] = await Promise.all([
    supabase.from('categories').select('id, name, slug'),
    productQuery,
  ]);

  const products = productsRes.data ?? [];
  const total = productsRes.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const categories = categoriesRes.data ?? [];

  return (
    <ShopClient
      key={`${categorySlug}-${sortOrder}-${page}`}
      initialProducts={products}
      categories={categories}
      currentPage={page}
      totalPages={totalPages}
      initialFilters={{ categorySlug, sortOrder, minPrice, maxPrice }}
    />
  );
}
