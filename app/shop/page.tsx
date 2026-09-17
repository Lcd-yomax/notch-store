import { supabasePublic as supabase } from '@/lib/supabase/public';
import ProductListing from '@/components/listing/ProductListing';
import { getListingFacets, listProducts, parseListingParams } from '@/lib/catalog/queries';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseListingParams(await searchParams);
  const scope = { categorySlug: filters.category || undefined };

  const [categoriesRes, listing, facets] = await Promise.all([
    supabase.from('categories').select('id, name, slug'),
    listProducts(scope, filters),
    getListingFacets(scope),
  ]);

  // Smartphone filters only make sense once the shopper narrowed down to a category.
  const showPhoneFilters = Boolean(scope.categorySlug) && facets.hasPhones;

  return (
    <ProductListing
      kind="shop"
      products={listing.products}
      total={listing.total}
      totalPages={listing.totalPages}
      filters={filters}
      facets={facets}
      categories={categoriesRes.data ?? []}
      showPhoneFilters={showPhoneFilters}
      showBrandFilter={showPhoneFilters}
    />
  );
}
