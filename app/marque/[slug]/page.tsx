import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductListing from '@/components/listing/ProductListing';
import { getBrand, getListingFacets, listProducts, parseListingParams } from '@/lib/catalog/queries';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const brand = await getBrand(decodeURIComponent((await params).slug));
  if (!brand) return { title: 'Marque introuvable' };

  const title = `${brand.name} au Maroc – Smartphones et accessoires`;
  const description = `Découvrez les produits ${brand.name} chez Notch-Tech : neufs et reconditionnés, garantie, livraison partout au Maroc et paiement à la livraison.`;
  return {
    title,
    description,
    alternates: { canonical: `/marque/${brand.slug}` },
    openGraph: { title, description, images: brand.logo_url ? [brand.logo_url] : [], type: 'website' },
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const brand = await getBrand(decodeURIComponent((await params).slug));
  if (!brand) notFound();

  // The brand comes from the route; brand/category query params do not apply here
  const filters = { ...parseListingParams(await searchParams), category: '', brands: [] };
  const scope = { brandId: brand.id };

  const [listing, facets] = await Promise.all([listProducts(scope, filters), getListingFacets(scope)]);

  return (
    <ProductListing
      kind="brand"
      name={brand.name}
      products={listing.products}
      total={listing.total}
      totalPages={listing.totalPages}
      filters={filters}
      facets={facets}
      showPhoneFilters={facets.hasPhones}
      showBrandFilter={false}
    />
  );
}
