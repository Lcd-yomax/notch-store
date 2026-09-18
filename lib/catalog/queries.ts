// Server-side catalog reads. Variations are ALWAYS read from the `public_variations` view.
import { cache } from 'react';
import { supabasePublic as supabase } from '@/lib/supabase/public';
import type { Brand, CardProduct, Condition, ProductDetail, PublicReview } from './types';
import { CONDITIONS, cardPricing, isUuid, ramsOf, storagesOf } from './variants';

export const CARD_FIELDS =
  'id, name, slug, thumbnail_url, hide_price, is_best_seller, created_at, brands(id, name, slug, logo_url), public_variations(*)';

export const LISTING_PAGE_SIZE = 12;

// ─── Product page ────────────────────────────────────────────────────────────

/** Route params arrive URL-encoded ("%C3%89couteurs-…") while slugs are stored decoded ("Écouteurs-…"). */
function decodeParam(value: string) {
  try {
    return decodeURIComponent(value).normalize('NFC');
  } catch {
    return value; // malformed escape sequence: look it up as-is
  }
}

export const getProductDetail = cache(async (rawIdOrSlug: string): Promise<ProductDetail | null> => {
  const idOrSlug = decodeParam(rawIdOrSlug);
  const { data, error } = await supabase
    .from('products')
    .select(
      `${CARD_FIELDS}, description, categories(id, name, slug),
      product_images(id, url, alt_text, sort_order, is_primary, variation_id),
      product_specs(group_name, label, value, label_ar, value_ar, sort_order)`
    )
    .eq('is_active', true)
    .eq(isUuid(idOrSlug) ? 'id' : 'slug', idOrSlug)
    .maybeSingle();

  if (error) console.error('Error fetching product:', error);
  return (data as unknown as ProductDetail) ?? null;
});

export const getApprovedReviews = cache(async (productId: string): Promise<PublicReview[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, full_name, stars, comment, image_url, created_at')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching reviews:', error);
  return (data as PublicReview[]) ?? [];
});

export const getBrand = cache(async (slug: string): Promise<Brand | null> => {
  const { data } = await supabase.from('brands').select('id, name, slug, logo_url').eq('slug', slug).maybeSingle();
  return (data as Brand) ?? null;
});

// ─── Listings (shop, category, brand) ────────────────────────────────────────

export type SortOrder = 'popular' | 'newest' | 'price-low' | 'price-high';
const SORTS: SortOrder[] = ['popular', 'newest', 'price-low', 'price-high'];

export interface ListingFilters {
  category: string;
  brands: string[];
  storages: number[];
  rams: number[];
  conditions: Condition[];
  inStock: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortOrder;
  page: number;
}

export interface ListingScope {
  categorySlug?: string;
  brandId?: string;
}

type SearchParams = Record<string, string | string[] | undefined>;

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
const list = (value: string | string[] | undefined) => single(value).split(',').map((s) => s.trim()).filter(Boolean);
const positiveInts = (value: string | string[] | undefined) =>
  list(value).map(Number).filter((n) => Number.isInteger(n) && n > 0);
const price = (value: string | string[] | undefined) => {
  const n = Number(single(value));
  return single(value) !== '' && Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseListingParams(params: SearchParams): ListingFilters {
  const sort = single(params.sort) as SortOrder;
  return {
    category: single(params.category),
    brands: list(params.brand),
    storages: positiveInts(params.storage),
    rams: positiveInts(params.ram),
    conditions: list(params.condition).filter((c): c is Condition => CONDITIONS.includes(c as Condition)),
    inStock: single(params.stock) === '1',
    minPrice: price(params.minPrice),
    maxPrice: price(params.maxPrice),
    sort: SORTS.includes(sort) ? sort : 'popular',
    page: Math.max(1, Math.floor(Number(single(params.page))) || 1),
  };
}

export async function listProducts(scope: ListingScope, filters: ListingFilters) {
  const empty = { products: [] as CardProduct[], total: 0, totalPages: 1 };

  let brandIds: string[] | null = null;
  if (filters.brands.length > 0) {
    const { data } = await supabase.from('brands').select('id').in('slug', filters.brands);
    brandIds = (data ?? []).map((b) => b.id);
    if (brandIds.length === 0) return empty;
  }

  const hasPriceRange = filters.minPrice != null || filters.maxPrice != null;
  const filtersVariations =
    filters.storages.length > 0 || filters.rams.length > 0 || filters.conditions.length > 0 || filters.inStock || hasPriceRange;

  // `fv` is a second, filtered embed of the view: it decides which products match,
  // while `public_variations` stays complete for display (all storages, prices...).
  const select = [
    CARD_FIELDS,
    'categories!inner(id, name, slug)',
    filtersVariations ? 'fv:public_variations!inner(id, storage_gb, ram_gb, condition, stock, price)' : null,
  ]
    .filter(Boolean)
    .join(', ');

  let query = supabase.from('products').select(select, { count: 'exact' }).eq('is_active', true);

  if (scope.categorySlug) query = query.eq('categories.slug', scope.categorySlug);
  if (scope.brandId) query = query.eq('brand_id', scope.brandId);
  if (brandIds) query = query.in('brand_id', brandIds);
  if (filters.storages.length > 0) query = query.in('fv.storage_gb', filters.storages);
  if (filters.rams.length > 0) query = query.in('fv.ram_gb', filters.rams);
  if (filters.conditions.length > 0) query = query.in('fv.condition', filters.conditions);
  // Phone stock is not sourced from the IMEI feed; any phone variation is
  // available in the storefront. Accessories still require positive stock.
  if (filters.inStock) query = query.or('stock.gt.0,storage_gb.not.is.null', { referencedTable: 'fv' });
  if (hasPriceRange) {
    // Hidden prices are NULL in the view: those products are not affected by the price range.
    const bounds = [
      filters.minPrice != null ? `price.gte.${filters.minPrice}` : null,
      filters.maxPrice != null ? `price.lte.${filters.maxPrice}` : null,
    ].filter(Boolean);
    const range = bounds.length > 1 ? `and(${bounds.join(',')})` : bounds[0];
    query = query.or(`price.is.null,${range}`, { referencedTable: 'fv' });
  }

  const from = (filters.page - 1) * LISTING_PAGE_SIZE;
  const byPrice = filters.sort === 'price-low' || filters.sort === 'price-high';

  if (filters.sort === 'popular') query = query.order('is_best_seller', { ascending: false });
  query = query.order('created_at', { ascending: false }).order('id');
  // Price lives on the variations, so price sorts are done here on the full (small) result set.
  if (!byPrice) query = query.range(from, from + LISTING_PAGE_SIZE - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error('Error listing products:', error);
    return empty;
  }

  let products = ((data ?? []) as unknown as (CardProduct & { fv?: unknown })[]).map(({ fv: _fv, ...product }) => product);
  const total = count ?? products.length;

  if (byPrice) {
    const direction = filters.sort === 'price-low' ? 1 : -1;
    products = products
      .map((product) => ({ product, price: cardPricing(product)?.price ?? null }))
      .sort((a, b) => {
        if (a.price == null || b.price == null) return (a.price == null ? 1 : 0) - (b.price == null ? 1 : 0);
        return (a.price - b.price) * direction;
      })
      .map(({ product }) => product)
      .slice(from, from + LISTING_PAGE_SIZE);
  }

  return { products, total, totalPages: Math.max(1, Math.ceil(total / LISTING_PAGE_SIZE)) };
}

export interface ListingFacets {
  brands: Brand[];
  storages: number[];
  rams: number[];
  conditions: Condition[];
  hasPhones: boolean;
  hasVisiblePrices: boolean;
}

/** Filter options available in a scope, computed from the unfiltered products of that scope. */
export async function getListingFacets(scope: ListingScope): Promise<ListingFacets> {
  let query = supabase
    .from('products')
    .select('hide_price, brands(id, name, slug, logo_url), categories!inner(slug), public_variations(storage_gb, ram_gb, condition, price)')
    .eq('is_active', true);
  if (scope.categorySlug) query = query.eq('categories.slug', scope.categorySlug);
  if (scope.brandId) query = query.eq('brand_id', scope.brandId);

  const { data, error } = await query;
  if (error) console.error('Error fetching facets:', error);
  const rows = (data ?? []) as unknown as Pick<CardProduct, 'hide_price' | 'brands' | 'public_variations'>[];

  const brands = new Map<string, Brand>();
  rows.forEach((row) => row.brands && brands.set(row.brands.id, row.brands));
  const variations = rows.flatMap((row) => row.public_variations);
  const phoneVariations = variations.filter((v) => v.storage_gb != null);

  return {
    brands: Array.from(brands.values()).sort((a, b) => a.name.localeCompare(b.name)),
    storages: storagesOf(phoneVariations),
    rams: ramsOf(phoneVariations),
    conditions: CONDITIONS.filter((c) => phoneVariations.some((v) => v.condition === c)),
    hasPhones: phoneVariations.length > 0,
    hasVisiblePrices: rows.some((row) => !row.hide_price),
  };
}
