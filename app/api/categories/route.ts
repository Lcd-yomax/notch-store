import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, products(count)')
      .order('name');
      
    if (error) {
      console.error('Supabase Categories Error:', error);
      throw error;
    }
    
    return NextResponse.json(data, {
      headers: {
        // Categories change rarely — cache for 1 hour, stale-while-revalidate for 10 min
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

