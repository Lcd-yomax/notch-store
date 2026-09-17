'use client';

import { useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { pixelInitiateCheckout, pixelPurchase } from '@/lib/pixel';
import type { PublicVariation } from '@/lib/catalog/types';

interface Props {
  variation: PublicVariation | null;
  formRef: RefObject<HTMLFormElement | null>;
}

/** Quantity + cash-on-delivery order form, for products with a visible price. */
export default function OrderForm({ variation, formRef }: Props) {
  const { t, language } = useLanguage();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [orderName, setOrderName] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = Number(variation?.price ?? 0);
  const outOfStock = !variation || variation.stock <= 0;
  const maxQuantity = Math.max(1, Math.min(10, variation?.stock ?? 1));
  // Another variant may have less stock than the quantity already chosen
  if (quantity > maxQuantity) setQuantity(maxQuantity);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variation) return;
    setIsSubmitting(true);
    setError(null);

    try {
      pixelInitiateCheckout({ value: price * quantity, numItems: quantity, currency: 'MAD' });

      // Prices are never sent: the server reads them from the database.
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: orderName,
          phone: orderPhone,
          address: orderAddress,
          city: orderCity,
          notes: `Couleur: ${variation.color || 'N/A'} | Taille: ${variation.size || 'N/A'} | Qté: ${quantity}`,
          items: [{ variation_id: variation.id, quantity }],
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
      console.error('Order submission error:', err);
      setError(t.orderErrors.generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.product.quantity}</span>
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden" dir="ltr">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors text-xl font-bold cursor-pointer disabled:opacity-40"
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
            className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors text-xl font-bold cursor-pointer disabled:opacity-40"
            disabled={quantity >= maxQuantity}
          >
            +
          </button>
        </div>
        {quantity > 1 && (
          <span className="text-sm font-bold text-primary">
            Total: {(price * quantity).toLocaleString('fr-MA')} DH
          </span>
        )}
      </div>

      {t.product.orderForm?.title && <h2 className="text-lg font-bold text-slate-900 mb-2">{t.product.orderForm.title}</h2>}

      <form ref={formRef} onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4 p-6 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="orderName" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm?.fullName || 'Nom complet'}</label>
            <input id="orderName" type="text" required value={orderName} onChange={(e) => setOrderName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="orderPhone" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm?.phone || 'Téléphone'}</label>
            <input
              id="orderPhone"
              type="tel"
              required
              dir="ltr"
              pattern="^0[678][0-9]{8}$"
              title="Le numéro doit commencer par 06, 07 ou 08 et contenir 10 chiffres (ex: 0612345678)"
              value={orderPhone}
              onChange={(e) => setOrderPhone(e.target.value)}
              className={`${inputClass} rtl:text-right`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="orderAddress" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm?.address || 'Adresse'}</label>
          <input id="orderAddress" type="text" required value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="orderCity" className="block text-sm font-bold text-slate-700 mb-2">{t.product.orderForm?.city || 'Ville'}</label>
          <input id="orderCity" type="text" required value={orderCity} onChange={(e) => setOrderCity(e.target.value)} className={inputClass} />
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            type="submit"
            disabled={isSubmitting || outOfStock}
            className="btn-glow-shake flex-1 w-full bg-primary hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-xl py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            {isSubmitting ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : <ShoppingBag size={24} />}
            {isSubmitting ? 'Envoi en cours...' : outOfStock ? t.product.outOfStock : t.product.orderNow || 'Acheter maintenant'}
          </button>
        </div>
      </form>
    </>
  );
}
