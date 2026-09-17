export type Condition = 'neuf' | 'reconditionne' | 'occasion';

/** Row of the `public_variations` view. Prices are NULL when hide_price is true. */
export interface PublicVariation {
  id: string;
  product_id: string;
  sku: string;
  color: string | null;
  size: string | null;
  storage_gb: number | null;
  ram_gb: number | null;
  condition: Condition;
  warranty_months: number | null;
  price: number | null;
  price_display: number | null;
  discount_label: string | null;
  stock: number;
  is_active: boolean;
  hide_price: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  variation_id: string | null;
}

export interface ProductSpec {
  group_name: string;
  label: string;
  value: string;
  label_ar: string | null;
  value_ar: string | null;
  sort_order: number;
}

/** Product shape used by every card (listing, home, search). */
export interface CardProduct {
  reviews?: { stars: number }[];
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
  hide_price: boolean;
  is_best_seller: boolean;
  created_at: string;
  brands: Brand | null;
  categories?: CategoryRef | null;
  public_variations: PublicVariation[];
}

export interface ProductDetail extends CardProduct {
  description: string | null;
  product_images: ProductImage[];
  product_specs: ProductSpec[];
}

export interface PublicReview {
  id: string;
  full_name: string;
  stars: number;
  comment: string | null;
  image_url: string | null;
  created_at: string;
}
