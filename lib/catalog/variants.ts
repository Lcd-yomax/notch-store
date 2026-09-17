// Pure helpers shared by server pages and client components (no Supabase, no React).
import type { CardProduct, Condition, ProductImage, ProductSpec, PublicVariation } from './types';

export const CONDITIONS: Condition[] = ['neuf', 'reconditionne', 'occasion'];

export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

/** A product "is a phone" as soon as one of its variations has a storage size. */
export const isPhone = (variations: PublicVariation[]) =>
  variations.some((v) => v.storage_gb != null);

export interface StorageUnits {
  gb: string;
  tb: string;
}

export const FR_UNITS: StorageUnits = { gb: 'Go', tb: 'To' };

/** 256 -> "256 Go", 1024 -> "1 To". */
export function formatStorage(gb: number, units: StorageUnits = FR_UNITS) {
  return gb >= 1024 && gb % 1024 === 0 ? `${gb / 1024} ${units.tb}` : `${gb} ${units.gb}`;
}

const uniqueSortedNumbers = (values: (number | null)[]) =>
  Array.from(new Set(values.filter((v): v is number => v != null))).sort((a, b) => a - b);

export const storagesOf = (variations: PublicVariation[]) =>
  uniqueSortedNumbers(variations.map((v) => v.storage_gb));

export const ramsOf = (variations: PublicVariation[]) =>
  uniqueSortedNumbers(variations.map((v) => v.ram_gb));

export type StockState = 'in' | 'low' | 'out';

export function stockState(stock: number): StockState {
  if (stock <= 0) return 'out';
  return stock <= 3 ? 'low' : 'in';
}

export const totalStock = (variations: PublicVariation[]) =>
  variations.reduce((sum, v) => sum + Math.max(0, v.stock), 0);

/** Lowest visible price of a product, used by cards, sorting and JSON-LD. */
export function cardPricing(product: Pick<CardProduct, 'hide_price' | 'public_variations'>) {
  if (product.hide_price) return null;
  const priced = product.public_variations.filter((v) => v.price != null);
  if (priced.length === 0) return null;
  const cheapest = priced.reduce((min, v) => (Number(v.price) < Number(min.price) ? v : min));
  const price = Number(cheapest.price);
  const priceDisplay = cheapest.price_display != null ? Number(cheapest.price_display) : null;
  const discount = priceDisplay && priceDisplay > price ? Math.round(((priceDisplay - price) / priceDisplay) * 100) : 0;
  return { price, priceDisplay, discount };
}

// ─── Variant picker ──────────────────────────────────────────────────────────

export type Dimension = 'storage_gb' | 'color' | 'condition' | 'size';
export type Selection = Partial<Record<Dimension, string | number | null>>;

export const dimensionsFor = (phone: boolean): Dimension[] =>
  phone ? ['storage_gb', 'color', 'condition'] : ['color', 'size'];

/** Phones: storage ascending, then condition order. Accessories keep database order. */
export function sortVariations(variations: PublicVariation[], phone: boolean) {
  if (!phone) return variations;
  return [...variations].sort(
    (a, b) =>
      (a.storage_gb ?? 0) - (b.storage_gb ?? 0) ||
      CONDITIONS.indexOf(a.condition) - CONDITIONS.indexOf(b.condition)
  );
}

export interface DimensionOption {
  value: string | number;
  inStock: boolean;
}

/** Options for one dimension, given the selections made on the dimensions before it. */
export function optionsFor(
  variations: PublicVariation[],
  dimensions: Dimension[],
  selection: Selection,
  index: number
): DimensionOption[] {
  const dimension = dimensions[index];
  const pool = variations.filter((v) =>
    dimensions.slice(0, index).every((d) => selection[d] == null || v[d] === selection[d])
  );
  const values: (string | number)[] = [];
  for (const v of pool) {
    const value = v[dimension];
    if (value != null && !values.includes(value)) values.push(value);
  }
  if (dimension === 'storage_gb') values.sort((a, b) => Number(a) - Number(b));
  if (dimension === 'condition') values.sort((a, b) => CONDITIONS.indexOf(a as Condition) - CONDITIONS.indexOf(b as Condition));
  return values.map((value) => ({
    value,
    inStock: pool.some((v) => v[dimension] === value && v.stock > 0),
  }));
}

/**
 * Make a selection consistent: every dimension after `keepUpTo` keeps its value only if it is
 * still offered (and in stock when possible), otherwise the first in-stock option is chosen.
 */
export function resolveSelection(
  variations: PublicVariation[],
  dimensions: Dimension[],
  selection: Selection,
  keepUpTo = -1
): Selection {
  const next: Selection = { ...selection };
  dimensions.forEach((dimension, index) => {
    const options = optionsFor(variations, dimensions, next, index);
    if (options.length === 0) {
      next[dimension] = null;
      return;
    }
    const current = options.find((o) => o.value === next[dimension]);
    if (current && (index <= keepUpTo || current.inStock || !options.some((o) => o.inStock))) return;
    next[dimension] = (options.find((o) => o.inStock) ?? options[0]).value;
  });
  return next;
}

export function selectionOf(variation: PublicVariation, dimensions: Dimension[]): Selection {
  return Object.fromEntries(dimensions.map((d) => [d, variation[d]]));
}

export function matchVariation(variations: PublicVariation[], dimensions: Dimension[], selection: Selection) {
  const candidates = variations.filter((v) =>
    dimensions.every((d) => selection[d] == null || v[d] === selection[d])
  );
  return candidates.find((v) => v.stock > 0) ?? candidates[0] ?? null;
}

export function defaultVariation(variations: PublicVariation[]) {
  return variations.find((v) => v.stock > 0) ?? variations[0] ?? null;
}

// ─── Images & specs ──────────────────────────────────────────────────────────

const byOrder = (a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order;

/** Images of the selected variation, falling back to the product-level images. */
export function galleryFor(images: ProductImage[], variationId: string | null, thumbnail: string | null) {
  const own = variationId ? images.filter((i) => i.variation_id === variationId).sort(byOrder) : [];
  if (own.length > 0) return own.map((i) => i.url);
  const general = images.filter((i) => !i.variation_id).sort(byOrder);
  if (general.length > 0) return general.map((i) => i.url);
  return thumbnail ? [thumbnail] : [];
}

export function localizeSpec(spec: ProductSpec, language: 'fr' | 'ar') {
  return {
    label: language === 'ar' && spec.label_ar ? spec.label_ar : spec.label,
    value: language === 'ar' && spec.value_ar ? spec.value_ar : spec.value,
  };
}

export type KeySpecKey = 'screen' | 'battery' | 'camera' | 'network';

const KEY_SPEC_PATTERNS: Record<KeySpecKey, RegExp> = {
  screen: /[ée]cran|display|affichage/i,
  battery: /batterie|battery|autonomie/i,
  camera: /cam[ée]ra|appareil photo|photo/i,
  network: /r[ée]seau|network|connectivit[ée]|5g|4g/i,
};

/** First spec matching each key (by label, then by group name). */
export function keySpecsOf(specs: ProductSpec[]) {
  const sorted = [...specs].sort((a, b) => a.sort_order - b.sort_order);
  return (Object.keys(KEY_SPEC_PATTERNS) as KeySpecKey[])
    .map((key) => {
      const pattern = KEY_SPEC_PATTERNS[key];
      const spec = sorted.find((s) => pattern.test(s.label)) ?? sorted.find((s) => pattern.test(s.group_name));
      return spec ? { key, spec } : null;
    })
    .filter((entry): entry is { key: KeySpecKey; spec: ProductSpec } => entry !== null);
}

/** Specs grouped by group_name, groups in order of their first spec. */
export function groupSpecs(specs: ProductSpec[]) {
  const groups = new Map<string, ProductSpec[]>();
  for (const spec of [...specs].sort((a, b) => a.sort_order - b.sort_order)) {
    groups.set(spec.group_name, [...(groups.get(spec.group_name) ?? []), spec]);
  }
  return Array.from(groups, ([name, items]) => ({ name, items }));
}
