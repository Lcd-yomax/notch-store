import CategoriesPageClient from '@/components/CategoriesPageClient';
import { getStorefrontCategories, type StorefrontCategory } from '@/lib/catalog/queries';

// Rendered on the server (cached 1 hour) so the cards and their images are in the first HTML,
// instead of waiting for the page JavaScript and an /api/categories round trip.
export const revalidate = 3600;

export default async function Categories() {
  let categories: StorefrontCategory[] = [];
  try {
    categories = await getStorefrontCategories();
  } catch (error) {
    console.error('Failed to load categories', error);
  }

  return <CategoriesPageClient categories={categories} />;
}
