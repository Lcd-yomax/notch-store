// Categories hidden from the customer-facing storefront. They remain available
// in the dashboard so their products and settings can still be managed.
export const HIDDEN_CATEGORY_SLUGS = new Set(['diffuseur-de-parfum']);

export function isStorefrontCategoryVisible(category: { slug?: string | null; is_active?: boolean | null }) {
  return category.is_active !== false && !HIDDEN_CATEGORY_SLUGS.has(category.slug ?? '');
}
