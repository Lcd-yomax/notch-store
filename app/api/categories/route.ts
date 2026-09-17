import { NextResponse } from 'next/server';
import { supabasePublic as supabase } from '@/lib/supabase/public';
import { isStorefrontCategoryVisible } from '@/lib/catalog/categoryVisibility';

export async function GET() {
  try {
    let { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, is_active, products(count)')
      .order('name');

    // Keep the storefront usable while the category visibility migration is being deployed.
    if (error && /is_active/i.test(error.message)) {
      const fallback = await supabase
        .from('categories')
        .select('id, name, slug, image_url, products(count)')
        .order('name');
      data = (fallback.data ?? []).map((category) => ({ ...category, is_active: true }));
      error = fallback.error;
    }
      
    if (error) {
      console.error('Supabase Categories Error:', error);
      throw error;
    }
    
    return NextResponse.json((data ?? []).filter(isStorefrontCategoryVisible), {
      headers: {
        // Categories change rarely — cache for 1 hour, stale-while-revalidate for 10 min
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

