import { NextResponse } from 'next/server';
import { getStorefrontCategories } from '@/lib/catalog/queries';

export async function GET() {
  try {
    const categories = await getStorefrontCategories();
    return NextResponse.json(categories, {
      headers: {
        // Categories change rarely — cache for 1 hour, stale-while-revalidate for 10 min
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Supabase Categories Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
