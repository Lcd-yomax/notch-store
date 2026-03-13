import { supabase } from './supabase';

export type CreateReviewInput = {
  product_id: string;
  full_name: string;
  email: string;
  stars: number;
  comment?: string;
  image_url?: string;
};

/**
 * Service for handling Review related database operations.
 */
export const createReview = async (reviewData: CreateReviewInput) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        product_id: reviewData.product_id,
        full_name: reviewData.full_name,
        email: reviewData.email,
        stars: reviewData.stars,
        comment: reviewData.comment,
        image_url: reviewData.image_url,
        // is_approved defaults to false in the DB
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    return { success: false, error };
  }

  // Note: The database trigger 'on_new_review_created' will automatically 
  // insert a notification into the 'notifications' table because of this insert.

  return { success: true, data };
};

export const getApprovedReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true) // Only show approved reviews to the public
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data;
};
