// ─── Meta Pixel Helper ─────────────────────────────────────────────────────
// All pixel events are fired through this file.
// Replace PIXEL_ID with your real Meta Pixel ID from your client's Ads Manager.
// ─────────────────────────────────────────────────────────────────────────────

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '706701205082894';

/** Declare fbq on the global window so TypeScript doesn't complain */
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

/** Fire a standard Meta Pixel event */
export function fbqEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
}

/** Fire a custom Meta Pixel event */
export function fbqCustomEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params);
  }
}

// ─── Typed Pixel Events ───────────────────────────────────────────────────────

/** Fired when a user views a product page */
export function pixelViewContent(product: {
  id: string | number;
  name: string;
  price: number;
  currency?: string;
}) {
  fbqEvent('ViewContent', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: product.currency || 'MAD',
  });
}

/** Fired when a user clicks "Add to Cart" */
export function pixelAddToCart(product: {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
}) {
  fbqEvent('AddToCart', {
    content_ids: [String(product.id)],
    content_name: product.name,
    content_type: 'product',
    value: product.price * (product.quantity || 1),
    currency: product.currency || 'MAD',
    num_items: product.quantity || 1,
  });
}

/** Fired when a user reaches the checkout page */
export function pixelInitiateCheckout(params: {
  value: number;
  numItems: number;
  currency?: string;
}) {
  fbqEvent('InitiateCheckout', {
    value: params.value,
    currency: params.currency || 'MAD',
    num_items: params.numItems,
  });
}

/** Fired when an order is successfully placed (success page) */
export function pixelPurchase(params: {
  value: number;
  currency?: string;
  orderId?: string;
}) {
  fbqEvent('Purchase', {
    value: params.value,
    currency: params.currency || 'MAD',
    ...(params.orderId ? { order_id: params.orderId } : {}),
  });
}
