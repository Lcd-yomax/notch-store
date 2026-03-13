import { supabase } from './supabase';

/**
 * Service for handling Category related database operations.
 */

const mapToUICategory = (dbCategory: any) => {
  // We use the dbCategory.image_url, falling back to a placeholder if null. 
  // We also auto-generate translation keys based on the literal category name.
  return {
    id: dbCategory.slug, // The UI uses the ID as the param, which usually maps well to slug
    dbId: dbCategory.id,
    nameKey: dbCategory.name,
    descKey: `${dbCategory.name}_desc`, // Auto-generate translation key for description
    image: dbCategory.image_url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop',
    itemCount: Math.floor(Math.random() * 50) + 5, // Temporary aggregate fallback
  };
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data || []).map(mapToUICategory);
};
