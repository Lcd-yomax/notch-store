// Server-side pack reads, always from the `public_packs` view: it only returns
// sellable packs and never exposes a hidden price.
import { cache } from 'react';
import { supabasePublic as supabase } from '@/lib/supabase/public';
import { isUuid } from './variants';

export interface PublicPackItem {
  variation_id: string;
  product_id: string;
  product_name: string;
  product_slug: string | null;
  thumbnail_url: string | null;
  color: string | null;
  size: string | null;
  storage_gb: number | null;
  ram_gb: number | null;
  quantity: number;
}

export interface PublicPack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  discount_percent: number;
  sort_order: number;
  /** A product of the pack has a hidden price: prices are NULL, ordered via WhatsApp */
  hide_price: boolean;
  original_price: number | null;
  pack_price: number | null;
  in_stock: boolean;
  items: PublicPackItem[];
}

const normalize = (pack: PublicPack): PublicPack => ({
  ...pack,
  discount_percent: Number(pack.discount_percent),
  original_price: pack.original_price == null ? null : Number(pack.original_price),
  pack_price: pack.pack_price == null ? null : Number(pack.pack_price),
});

export const getPacks = cache(async (): Promise<PublicPack[]> => {
  const { data, error } = await supabase
    .from('public_packs')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  // Before the add_packs_and_popups migration the view does not exist: no packs yet
  if (error) {
    console.error('Error fetching packs:', error.message);
    return [];
  }
  return ((data ?? []) as PublicPack[]).map(normalize);
});

export const getPack = cache(async (idOrSlug: string): Promise<PublicPack | null> => {
  let value = idOrSlug;
  try {
    value = decodeURIComponent(idOrSlug);
  } catch {
    // malformed escape: look it up as-is
  }
  const { data, error } = await supabase
    .from('public_packs')
    .select('*')
    .eq(isUuid(value) ? 'id' : 'slug', value)
    .maybeSingle();

  if (error) {
    console.error('Error fetching pack:', error.message);
    return null;
  }
  return data ? normalize(data as PublicPack) : null;
});
