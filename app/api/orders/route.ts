import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      full_name, 
      city, 
      address, 
      phone, 
      email, 
      total_amount, 
      notes, 
      items 
    } = body;
    
    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        full_name,
        city,
        address,
        phone,
        email,
        total_amount,
        notes,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Supabase Order Insert Error:', orderError);
      throw orderError;
    }

    // 2. Insert order items
    if (items && items.length > 0) {
      const orderItemsToInsert = items.map((item: any) => ({
        order_id: order.id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        console.error('Supabase Order Items Insert Error:', itemsError);
        throw itemsError;
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order Creation Endpoint Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
