import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { fr } from '@/lib/i18n/dictionaries/fr';
import { ar } from '@/lib/i18n/dictionaries/ar';
import { en } from '@/lib/i18n/dictionaries/en';
import { fill } from '@/lib/i18n/format';
import { LANGUAGES, type Language } from '@/lib/i18n/languages';

type ErrorKey = keyof typeof fr.orderErrors;

const DICTIONARIES: Record<Language, typeof fr.orderErrors> = {
  fr: fr.orderErrors,
  ar: ar.orderErrors,
  en: en.orderErrors,
};

/** Errors carry every language; the storefront shows the one currently selected. */
function orderError(
  status: number,
  key: ErrorKey,
  values: (dict: typeof fr.orderErrors) => Record<string, string | number> = () => ({})
) {
  const message = Object.fromEntries(
    LANGUAGES.map((lang) => [lang, fill(DICTIONARIES[lang][key], values(DICTIONARIES[lang]))])
  ) as Record<Language, string>;

  return NextResponse.json({ error: key, message }, { status });
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return orderError(400, 'invalid');
  }

  const full_name = text(body?.full_name, 120);
  const city = text(body?.city, 80);
  const address = text(body?.address, 300);
  const phone = text(body?.phone, 20).replace(/[\s.-]/g, '');
  const email = text(body?.email, 160) || null;
  const notes = text(body?.notes, 1000) || null;

  if (!full_name || !city || !address || !/^0[5-8][0-9]{8}$/.test(phone)) {
    return orderError(400, 'invalid');
  }

  // Client prices and totals are ignored: only variation ids and quantities are trusted.
  const quantities = new Map<string, number>();
  for (const item of Array.isArray(body?.items) ? body.items : []) {
    const quantity = Number(item?.quantity);
    if (typeof item?.variation_id !== 'string' || !UUID.test(item.variation_id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      return orderError(400, 'invalid');
    }
    quantities.set(item.variation_id, (quantities.get(item.variation_id) ?? 0) + quantity);
  }
  if (quantities.size === 0) return orderError(400, 'emptyOrder');

  try {
    // Real prices come from product_variations (server only, service role).
    const { data: variations, error: variationsError } = await supabase
      .from('product_variations')
      .select('id, price, stock, storage_gb, is_active, products!inner(name, is_active, hide_price, categories(slug))')
      .in('id', Array.from(quantities.keys()));

    if (variationsError) throw variationsError;

    let total = 0;
    const orderItems: { variation_id: string; quantity: number; unit_price: number }[] = [];

    for (const [variationId, quantity] of quantities) {
      const variation = (variations ?? []).find((v) => v.id === variationId);
      const product = variation?.products as unknown as {
        name: string;
        is_active: boolean;
        hide_price: boolean;
        categories?: { slug?: string | null } | null;
      } | undefined;

      if (!variation || !product) return orderError(409, 'unavailable', (dict) => ({ name: dict.unknownProduct }));
      const name = () => ({ name: product.name });
      if (!variation.is_active || !product.is_active) return orderError(409, 'unavailable', name);
      if (product.hide_price) return orderError(409, 'priceOnRequest', name);
      // A variation without a price (price <= 0) can never be ordered
      if (!(Number(variation.price) > 0)) return orderError(409, 'unavailable', name);
      const phone = variation.storage_gb != null || product.categories?.slug === 'smartphones';
      if (!phone && variation.stock < quantity) {
        return orderError(409, 'outOfStock', () => ({ name: product.name, stock: Math.max(0, variation.stock) }));
      }

      const unitPrice = Number(variation.price);
      total += unitPrice * quantity;
      orderItems.push({ variation_id: variationId, quantity, unit_price: unitPrice });
    }

    const { data: order, error: orderInsertError } = await supabase
      .from('orders')
      .insert([{ full_name, city, address, phone, email, notes, total_amount: Math.round(total * 100) / 100, status: 'pending' }])
      .select()
      .single();

    if (orderInsertError) throw orderInsertError;

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map((item) => ({ ...item, order_id: order.id })));

    if (itemsError) {
      // Do not leave an order without items behind
      await supabase.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order Creation Endpoint Error:', error);
    return orderError(500, 'generic');
  }
}
