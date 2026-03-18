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
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
