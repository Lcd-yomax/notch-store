import { NextResponse } from 'next/server';
import { supabasePublic as supabase } from '@/lib/supabase/public';
import { CARD_FIELDS } from '@/lib/catalog/queries';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const slug = searchParams.get('slug');
    const categorySlug = searchParams.get('category_slug');
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    const isFeatured = searchParams.get('is_featured');
    const isBestSeller = searchParams.get('is_best_seller');

    // Variations come from the public_variations view only (prices are NULL when hidden).
    let query = supabase
      .from('products')
      .select(`${CARD_FIELDS}, category_id, is_featured, categories!inner(id, name, slug)`)
      .eq('is_active', true);

    if (categoryId) query = query.eq('category_id', categoryId);
    if (slug) query = query.eq('slug', slug);
    if (id) query = query.eq('id', id);
    if (ids) query = query.in('id', ids.split(',').filter(Boolean).slice(0, 100));
    if (categorySlug) query = query.eq('categories.slug', categorySlug);
    if (isFeatured === 'true') query = query.eq('is_featured', true);
    if (isBestSeller === 'true') query = query.eq('is_best_seller', true);

    const { data, error } = await query;
    if (error) {
      console.error('Supabase Products Error:', error);
      throw error;
    }

    return NextResponse.json(data, {
      headers: {
        // Short cache: stock and hide_price changes must reach the cart check quickly
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
