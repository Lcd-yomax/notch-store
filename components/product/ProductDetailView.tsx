'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, StarHalf, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from './ProductGallery';
import VariantPicker from './VariantPicker';
import WhatsAppPriceButton from './WhatsAppPriceButton';
import OrderForm from './OrderForm';
import ProductReviews from './ProductReviews';
import { KeySpecs, SpecsTable } from './ProductSpecs';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { fill } from '@/lib/i18n/format';
import { pixelViewContent } from '@/lib/pixel';
import { ImageSizes } from '@/lib/imageUtils';
import type { ProductDetail, PublicReview } from '@/lib/catalog/types';
import {
  defaultVariation,
  dimensionsFor,
  formatStorage,
  galleryFor,
  isPhone,
  matchVariation,
  resolveSelection,
  selectionOf,
  sortVariations,
  type Selection,
} from '@/lib/catalog/variants';

interface Props {
  product: ProductDetail;
  reviews: PublicReview[];
  rating: { average: number; count: number };
}

function RatingStars({ average }: { average: number }) {
  return (
    <div className="flex items-center gap-1 rtl:flex-row-reverse" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) =>
        average >= star ? (
          <Star key={star} size={20} fill="currentColor" strokeWidth={0} className="text-amber-400" />
        ) : average >= star - 0.5 ? (
          <StarHalf key={star} size={20} fill="currentColor" strokeWidth={0} className="text-amber-400" />
        ) : (
          <Star key={star} size={20} fill="currentColor" strokeWidth={0} className="text-slate-200" />
        )
      )}
    </div>
  );
}

export default function ProductDetailView({ product, reviews, rating }: Props) {
  const { t } = useLanguage();

  const phone = isPhone(product.public_variations);
  const hidePrice = product.hide_price;
  const variations = useMemo(() => sortVariations(product.public_variations, phone), [product.public_variations, phone]);
  const dimensions = useMemo(() => dimensionsFor(phone), [phone]);

  const [state, setState] = useState(() => {
    const variation = defaultVariation(variations, phone);
    return {
      selection: variation ? selectionOf(variation, dimensions) : ({} as Selection),
      variationId: variation?.id ?? null,
    };
  });
  const variation = variations.find((v) => v.id === state.variationId) ?? null;

  // Restore the variant shared in the URL (?v=SKU). Read after mount so the page stays statically cached.
  useEffect(() => {
    if (!phone) return;
    const sku = new URLSearchParams(window.location.search).get('v');
    const fromUrl = sku ? variations.find((v) => v.sku === sku) : null;
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ selection: selectionOf(fromUrl, dimensions), variationId: fromUrl.id });
    }
  }, [phone, variations, dimensions]);

  useEffect(() => {
    pixelViewContent({
      id: product.id,
      name: product.name,
      price: hidePrice ? 0 : Number(variations[0]?.price ?? 0),
      currency: 'MAD',
    });
  }, [product.id, product.name, hidePrice, variations]);

  const selectOption = (index: number, value: string | number) => {
    const selection = resolveSelection(variations, dimensions, { ...state.selection, [dimensions[index]]: value }, index, phone);
    const next = matchVariation(variations, dimensions, selection, phone);
    setState({ selection, variationId: next?.id ?? null });

    if (phone && next) {
      const url = new URL(window.location.href);
      url.searchParams.set('v', next.sku);
      window.history.replaceState(window.history.state, '', url);
    }
  };

  // Phones show the images of the selected variation; accessories keep the full gallery.
  const images = phone
    ? galleryFor(product.product_images, variation?.id ?? null, product.thumbnail_url)
    : [...product.product_images].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url).concat(
        product.product_images.length === 0 && product.thumbnail_url ? [product.thumbnail_url] : []
      );

  const price = variation?.price != null ? Number(variation.price) : null;
  const originalPrice = variation?.price_display != null ? Number(variation.price_display) : null;
  const discount = !hidePrice && variation?.discount_label ? parseInt(variation.discount_label) || 0 : 0;

  // Sticky buy bar once the purchase block has scrolled out of view
  const formRef = useRef<HTMLFormElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyButton(entry.boundingClientRect.top < 0 && !entry.isIntersecting),
      { threshold: 0 }
    );
    if (triggerRef.current) observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    if (!formRef.current) return;
    requestAnimationFrame(() => {
      const y = formRef.current!.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setTimeout(() => formRef.current?.querySelector('input')?.focus(), 600);
    });
  };

  const stock = variation?.stock ?? 0;
  const stockBadge = (() => {
    if (phone) {
      return { ok: true, low: false, icon: 'check_circle', text: t.phone.inStock };
    }
    return stock > 0
      ? { ok: true, low: false, icon: 'check_circle', text: t.product.inStock }
      : { ok: false, low: false, icon: 'error', text: t.product.outOfStock };
  })();

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.header.home}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            {product.categories ? (
              <Link href={`/categories/${product.categories.slug}`} className="hover:text-primary transition-colors">{product.categories.name}</Link>
            ) : (
              <Link href="/categories" className="hover:text-primary transition-colors">{t.header.categories}</Link>
            )}
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <span className="text-slate-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          <div className="bg-white rounded-3xl p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ProductGallery key={phone ? variation?.id : 'all'} images={images} alt={product.name} discount={discount} />

              <div className="flex flex-col">
                <div className="mb-6">
                  {product.brands && (
                    <Link href={`/marque/${product.brands.slug}`} className="inline-block text-sm font-bold uppercase tracking-wider text-slate-400 hover:text-primary transition-colors mb-2">
                      {product.brands.name}
                    </Link>
                  )}
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">{product.name}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <RatingStars average={rating.average} />
                    {rating.count > 0 && <span className="text-slate-900 font-bold">{rating.average.toFixed(1)}</span>}
                    <span className="text-slate-400">({rating.count} {t.product.reviews})</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className={`font-bold flex items-center gap-1 ${!stockBadge.ok ? 'text-red-500' : stockBadge.low ? 'text-amber-600' : 'text-emerald-500'}`}>
                      <span className="material-symbols-outlined text-sm">{stockBadge.icon}</span>
                      {stockBadge.text}
                    </span>
                  </div>
                </div>

                {phone && variation && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {variation.ram_gb != null && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">
                        <span className="material-symbols-outlined text-base">memory</span>
                        <span dir="ltr">{fill(t.phone.ramValue, { size: formatStorage(variation.ram_gb, t.phone.units) })}</span>
                      </span>
                    )}
                    {variation.condition !== 'neuf' && (
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                          variation.condition === 'reconditionne' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {t.phone.conditions[variation.condition]}
                      </span>
                    )}
                    {variation.warranty_months != null && variation.warranty_months > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        {fill(t.phone.warranty, { n: variation.warranty_months })}
                      </span>
                    )}
                  </div>
                )}

                {phone && <KeySpecs specs={product.product_specs} />}

                <VariantPicker variations={variations} dimensions={dimensions} selection={state.selection} onSelect={selectOption} phone={phone} />

                <div className="flex items-end gap-4 mb-6">
                  {hidePrice ? (
                    <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">{t.phone.priceOnRequest}</span>
                  ) : (
                    <>
                      <span className="text-5xl font-black text-slate-900 tracking-tight">
                        {price ?? '—'} <span className="text-2xl">DH</span>
                      </span>
                      {originalPrice != null && <span className="text-xl text-slate-400 line-through font-medium mb-1.5">{originalPrice} DH</span>}
                    </>
                  )}
                </div>

                {hidePrice ? (
                  <WhatsAppPriceButton product={product} variation={variation} className="w-full text-lg sm:text-xl py-5 px-8 mb-4" />
                ) : (
                  <OrderForm variation={variation} formRef={formRef} phone={phone} />
                )}
                {!hidePrice && !stockBadge.ok && (
                  <Link href="/shop?stock=1" className="text-center font-bold text-slate-900 underline underline-offset-4 py-3 mb-4">{t.phoneDiscovery.availableProducts}</Link>
                )}

                <div className="flex items-center justify-center w-full gap-2 text-xl font-bold text-slate-700 py-2 mb-8 mt-0">
                  <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                  {t.product.freeShipping}
                </div>
                <div ref={triggerRef} className="h-1 w-full" aria-hidden="true" />

                <DescriptionAccordion html={product.description ?? ''} />

                {phone && product.product_specs.length > 0 ? (
                  <SpecsTable specs={product.product_specs} />
                ) : (
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{t.product.features}</h3>
                    <ul className="space-y-3">
                      {['Haute qualité', 'Design moderne'].map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-slate-600">
                          <span className="material-symbols-outlined text-primary mt-0.5 text-xl">check</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProductReviews productId={product.id} reviews={reviews} />
        </div>
      </main>
      <Footer />

      {/* Sticky bottom buy bar */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)] ${showStickyButton ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4 flex-1">
            {images[0] && (
              <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                <Image src={ImageSizes.thumbnail(images[0])} alt="" fill sizes="48px" className="object-cover" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm text-slate-900 font-bold truncate max-w-[300px] lg:max-w-[500px]">{product.name}</span>
              <span className="text-sm font-black text-primary">
                {hidePrice ? (
                  t.phone.priceOnRequest
                ) : (
                  <>
                    {price} DH
                    {originalPrice != null && <span className="text-xs text-slate-500 line-through font-medium ms-1">{originalPrice} DH</span>}
                  </>
                )}
              </span>
            </div>
          </div>
          {hidePrice ? (
            <WhatsAppPriceButton product={product} variation={variation} className="flex-1 sm:flex-none w-full sm:w-auto text-lg py-3 px-8" />
          ) : (
            <button
              type="button"
              disabled={!stockBadge.ok}
              onClick={scrollToForm}
              className="flex-1 sm:flex-none w-full sm:w-auto bg-primary hover:bg-amber-500 text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group disabled:bg-slate-200 disabled:text-slate-600 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
              {stockBadge.ok ? t.product.orderNow : t.product.outOfStock}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function DescriptionAccordion({ html }: { html: string }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);
  if (!html) return null;

  return (
    <div className="mb-8 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} className="w-full flex items-center justify-between py-4 group cursor-pointer">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">description</span>
          {t.product.description}
        </h3>
        <span className={`material-symbols-outlined text-slate-400 group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-2 pb-6">
            <div
              className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-strong:text-slate-800 prose-li:text-slate-600 prose-hr:border-slate-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
