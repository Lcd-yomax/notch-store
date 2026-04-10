import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const slug = searchParams.get('slug');
    const categorySlug = searchParams.get('category_slug');
    const id = searchParams.get('id');
    const isFeatured = searchParams.get('is_featured');
    const isBestSeller = searchParams.get('is_best_seller');

    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        thumbnail_url,
        is_featured,
        is_best_seller,
        category_id,
        categories!inner(id, name, slug),
        variations:product_variations(id, price, price_display, stock, color, size, discount_label),
        images:product_images(id, url, alt_text, is_primary, sort_order)
      `)
      .eq('is_active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (slug) {
      query = query.eq('slug', slug);
    }

    if (id) {
      query = query.eq('id', id);
    }

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug);
    }

    if (isFeatured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (isBestSeller === 'true') {
      query = query.eq('is_best_seller', true);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Supabase Products Error:', error);
      throw error;
    }

    return NextResponse.json(data, {
      headers: {
        // Cache 1 hour in browser/CDN; serve stale for 5 min while revalidating in background
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
