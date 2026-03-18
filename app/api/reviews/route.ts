import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

    let query = supabase
      .from('reviews')
      .select('*, products(name)')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;
      
    if (error) {
      console.error('Supabase Reviews GET Error:', error);
      throw error;
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, author_name, author_email, rating, content, images } = body;

    if (!product_id || !author_name || !rating || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        product_id,
        full_name: author_name,
        email: author_email,
        stars: rating,
        comment: content,
        image_url: images && images.length > 0 ? images[0] : null,
        is_approved: false // Reviews must be approved by admin
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase Reviews POST Error:', error);
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
