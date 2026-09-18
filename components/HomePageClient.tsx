'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestSellingProducts from '@/components/BestSellingProducts';
import ProductCard from '@/components/ProductCard';
import type { CardProduct } from '@/lib/catalog/types';
import { cardPricing, isPhone } from '@/lib/catalog/variants';
import { Star } from 'lucide-react';

export default function HomePageClient({
  featuredProducts,
  bestSellerProducts,
  latestPromos,
  reviewsData,
}: {
  featuredProducts: CardProduct[];
  bestSellerProducts: CardProduct[];
  latestPromos: CardProduct[];
  reviewsData: any[];
}) {
  const { t } = useLanguage();

  const reviews = reviewsData || [];
  const bestSellers = [...bestSellerProducts].sort((a, b) =>
    Number(isPhone(b.public_variations) || b.public_variations.some((v) => v.is_active && v.stock > 0)) -
    Number(isPhone(a.public_variations) || a.public_variations.some((v) => v.is_active && v.stock > 0))
  );
  const shown = new Set(bestSellers.map((product) => product.id));
  const featured = featuredProducts.filter((product) => !shown.has(product.id));
  featured.forEach((product) => shown.add(product.id));
  const promotions = latestPromos.filter((product) => !shown.has(product.id) && (cardPricing(product)?.discount ?? 0) > 0).slice(0, 4);

  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSlider />

        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 p-2 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
            {t.homeInfo.trust.map((item) => (
              <div key={item.icon} className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-slate-900 text-lg font-bold">{item.title}</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <CategorySlider />
        <BestSellingProducts products={bestSellers} />
        <FeaturedProducts products={featured} />

        {promotions.length > 0 && <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight mb-2">{t.home.latestPromos}</h2>
              <p className="text-slate-500 text-lg font-medium">{t.home.latestPromosDesc}</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              {t.home.seeAll}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promotions.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showRating
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ))}
          </div>
        </section>}

        <section className="bg-slate-50 border-y border-slate-200 py-20">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight mb-4">{t.home.reviewsTitle}</h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.home.reviewsDesc}</p>
            </div>
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {reviews.slice(0, 3).map((review: any) => (
                  <div key={review.id} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <span className="material-symbols-outlined absolute -top-2 -right-2 text-slate-100 text-8xl rotate-12 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                    <div className="relative z-10">
                      <div className="flex gap-1 mb-6 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={20} fill="currentColor" strokeWidth={0} className={i >= review.stars ? "text-slate-200" : "text-amber-400"} />
                        ))}
                      </div>
                      <p className="text-slate-700 text-lg leading-relaxed mb-8">&quot;{review.comment}&quot;</p>
                      <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase">
                          {review.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{review.full_name}</h4>
                          <span className="text-sm text-slate-500">
                            {review.products?.name ? t.home.verifiedCustomer + ` - ${review.products.name}` : t.home.verifiedCustomer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 italic">{t.homeInfo.noReviews}</div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="max-w-[1000px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight mb-4">{t.homeInfo.faqTitle}</h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.homeInfo.faqDesc}</p>
            </div>

            <div className="flex flex-col gap-4">
              {t.homeInfo.faq.map((item) => (
                <details key={item.q} className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <summary className="flex items-center justify-between gap-4 font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
