import type { Metadata } from 'next';
import { cache } from 'react';
import { supabasePublic as supabase } from '@/lib/supabase/public';
import ProductListing from '@/components/listing/ProductListing';
import { getListingFacets, listProducts, parseListingParams } from '@/lib/catalog/queries';
import { isStorefrontCategoryVisible } from '@/lib/catalog/categoryVisibility';
import { notFound } from 'next/navigation';

const SMARTPHONES_SLUG = 'smartphones';

const getCategory = cache(async (slug: string) => {
  const result = await supabase
    .from('categories')
    .select('id, name, slug, is_active')
    .eq('slug', slug)
    .maybeSingle();
  if (!result.error || !/is_active/i.test(result.error.message)) return result;
  return supabase.from('categories').select('id, name, slug').eq('slug', slug).maybeSingle();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const slug = decodeURIComponent((await params).id);
  const { data: category } = await getCategory(slug);
  if (!category || !isStorefrontCategoryVisible(category)) notFound();

  const title = `${category.name} au Maroc`;
  const description = slug === SMARTPHONES_SLUG
    ? 'Découvrez nos smartphones Apple, Samsung, Honor, Huawei, Oppo et Redmi chez Notch-Tech. Renseignez-vous sur les modèles et les prix. Livraison partout au Maroc.'
    : `Découvrez notre sélection ${category.name} chez Notch-Tech. Livraison partout au Maroc et paiement à la livraison.`;
  const url = `/categories/${encodeURIComponent(category.slug)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
    twitter: { title, description },
  };
}

export default async function CategoryDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const slug = decodeURIComponent((await params).id);
  // The category comes from the route, never from the query string
  const filters = { ...parseListingParams(await searchParams), category: '' };
  const scope = { categorySlug: slug };

  const [categoryRes, listing, facets] = await Promise.all([
    getCategory(slug),
    listProducts(scope, filters),
    getListingFacets(scope),
  ]);

  if (!categoryRes.data || !isStorefrontCategoryVisible(categoryRes.data)) notFound();

  const categoryName =
    categoryRes.data?.name ?? slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const isSmartphones = slug === SMARTPHONES_SLUG;

  return (
    <ProductListing
      kind="category"
      name={categoryName}
      products={listing.products}
      total={listing.total}
      totalPages={listing.totalPages}
      filters={filters}
      facets={facets}
      showPhoneFilters={facets.hasPhones}
      showBrandFilter={facets.hasPhones}
      brandLogos={isSmartphones ? facets.brands : undefined}
    />
  );
}
