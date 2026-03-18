import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const slug = searchParams.get('slug');
    const categorySlug = searchParams.get('category_slug');
    const id = searchParams.get('id');

    let query = supabase
      .from('products')
      .select(`
        *,
        categories!inner(id, name, slug),
        variations:product_variations(*),
        images:product_images(*)
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

    const { data, error } = await query;
    if (error) {
      console.error('Supabase Products Error:', error);
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
