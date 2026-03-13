import { supabase } from './supabase';

/**
 * Service for handling Product related database operations.
 * It fetches the relational data from Supabase and maps it to the flat structure
 * expected by the UI components (originally defined in dummyData.ts).
 */

// Helper to map DB Product to UI Product shape
const mapToUIProduct = (dbProduct: any) => {
  // Extract primary and secondary images
  const images = dbProduct.product_images || [];
  const primaryImage = images.find((i: any) => i.is_primary)?.url || dbProduct.thumbnail_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop';
  const secondaryImage = images.find((i: any) => !i.is_primary)?.url || primaryImage;
  
  // Extract pricing from the first variation (simplification for UI)
  const mainVariation = dbProduct.product_variations?.[0] || { price: 0 };
  
  // Extract numeric discount if available (discount_label might be "30% OFF")
  let discountNum = 0;
  if (mainVariation.discount_label) {
    const match = mainVariation.discount_label.match(/(\d+)/);
    if (match) discountNum = parseInt(match[1]);
  }

  // Calculate fake rating/reviews fallback (since reviews logic is separate)
  const rating = 4.5 + (Math.random() * 0.5); // 4.5 to 5.0
  const reviews = Math.floor(Math.random() * 200) + 10;

  return {
    id: dbProduct.id,
    nameKey: dbProduct.name, // the DB name column holds the translation key currently
    slug: dbProduct.slug,
    price: Number(mainVariation.price),
    originalPrice: mainVariation.price_display ? Number(mainVariation.price_display) : undefined,
    discount: discountNum || undefined,
    rating: Number(rating.toFixed(1)),
    reviews,
    image: primaryImage,
    hoverImage: secondaryImage,
    categoryId: dbProduct.category_id,
    badge: dbProduct.is_best_seller ? 'bestSeller' : dbProduct.is_featured ? 'popular' : undefined,
  };
};

export const getShopProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variations (*),
      product_images (*)
    `)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(mapToUIProduct);
};

export const getFeaturedProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variations (*),
      product_images (*)
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(5);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return (data || []).map(mapToUIProduct);
};

export const getBestSellingProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variations (*),
      product_images (*)
    `)
    .eq('is_active', true)
    .eq('is_best_seller', true)
    .limit(4);

  if (error) {
    console.error('Error fetching best selling products:', error);
    return [];
  }

  return (data || []).map(mapToUIProduct);
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variations (*),
      product_images (*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching product:', error);
    return null;
  }

  return mapToUIProduct(data);
};
