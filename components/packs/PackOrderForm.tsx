'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { pixelInitiateCheckout, pixelPurchase } from '@/lib/pixel';
import type { PublicPack } from '@/lib/catalog/packs';

/** Cash-on-delivery order form for a pack. The server computes the price again. */
export default function PackOrderForm({ pack }: { pack: PublicPack }) {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [orderName, setOrderName] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = pack.pack_price ?? 0;
  const maxQuantity = 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      pixelInitiateCheckout({ value: price * quantity, numItems: quantity, currency: 'MAD' });

      // Only the pack id and quantity are sent: prices are read from the database.
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: orderName,
          phone: orderPhone,
          address: orderAddress,
          city: orderCity,
          pack_id: pack.id,
          quantity,
        }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message?.[language] ?? t.orderErrors.generic);
        return;
      }

      pixelPurchase({ value: Number(data?.order?.total_amount ?? price * quantity), currency: 'MAD' });
      router.push('/success');
    } catch (err) {
      console.error('Pack order submission error:', err);
      setError(t.orderErrors.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.product.quantity}</span>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden" dir="ltr">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xl font-bold cursor-pointer disabled:opacity-40"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span className="w-12 h-11 flex items-center justify-center text-slate-900 font-black text-lg border-x border-slate-200 select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xl font-bold cursor-pointer disabled:opacity-40"
            disabled={quantity >= maxQuantity}
          >
            +
          </button>
        </div>
        {quantity > 1 && (
          <span className="text-sm font-bold text-primary">Total: {(price * quantity).toLocaleString('fr-MA')} DH</span>
        )}
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-2">{t.product.orderForm.title}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="packOrderName" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm.fullName}</label>
            <input id="packOrderName" type="text" required value={orderName} onChange={(e) => setOrderName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="packOrderPhone" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm.phone}</label>
            <input
              id="packOrderPhone"
              type="tel"
              required
              dir="ltr"
              pattern="^0[678][0-9]{8}$"
              title={t.common.phoneFormatHint}
              value={orderPhone}
              onChange={(e) => setOrderPhone(e.target.value)}
              className={`${inputClass} rtl:text-right`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="packOrderAddress" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm.address}</label>
          <input id="packOrderAddress" type="text" required value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="packOrderCity" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm.city}</label>
          <input id="packOrderCity" type="text" required value={orderCity} onChange={(e) => setOrderCity(e.target.value)} className={inputClass} />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !pack.in_stock}
          className="btn-glow-shake w-full bg-primary hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-xl py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer mt-2"
        >
          {isSubmitting ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <ShoppingBag size={24} />}
          {isSubmitting ? t.common.sending : !pack.in_stock ? t.product.outOfStock : t.packs.orderPack}
        </button>
      </form>
    </>
  );
}
