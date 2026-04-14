'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ImageSizes } from '@/lib/imageUtils';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestSellingProducts from '@/components/BestSellingProducts';
import ProductCompareSlider from '@/components/ProductCompareSlider';
import { Star, ShoppingBag } from 'lucide-react';

export default function HomePageClient({ productsData, reviewsData }: { productsData: any[], reviewsData: any[] }) {
  const { t } = useLanguage();

  const latestPromos = productsData.slice(9, 13) || productsData.slice(0, 4) || [];
  const reviews = reviewsData || [];

  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSlider />

        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 p-2 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 text-lg font-bold">Livraison Rapide</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Recevez votre commande en 24/48h partout au Maroc. Casablanca, Rabat, Marrakech, Fès, Tanger, Dakhla — nous livrons dans toute la région.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">payments</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 text-lg font-bold">Paiement à la Livraison</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Payez cash à la réception de votre colis. Aucune carte bancaire requise. 100% sécurisé et sans risque pour vous.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 text-lg font-bold">Garantie Qualité</h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Tous nos produits sont 100% originaux et testés avant expédition. Retours acceptés sous 7 jours sans questions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <CategorySlider />
        <BestSellingProducts />
        <ProductCompareSlider />
        <FeaturedProducts />

        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-20">
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
            {latestPromos.map((product: any) => {
              const productName = product.name;
              const price = product.variations?.[0]?.price;
              const priceDisplay = product.variations?.[0]?.price_display || null;
              const discount = priceDisplay && price && priceDisplay > price ? Math.round(((priceDisplay - price) / priceDisplay) * 100) : 0;

              return (
                <div key={product.id} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                      -{discount}%
                    </div>
                  )}
                  <Link href={`/product/${product.slug || product.id}`} className="relative w-full aspect-[4/3] overflow-hidden block">
                    {product.thumbnail_url ? (
                      <Image
                        src={ImageSizes.small(product.thumbnail_url || '')}
                        alt={productName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain group-hover:scale-110 transition-transform duration-500 p-4"

                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200"></div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow gap-4">
                    <div>
                      <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="text-slate-900 text-lg font-bold leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">{productName}</h3>
                      </Link>
                      <p className="text-slate-500 text-sm line-clamp-2 mb-2 leading-relaxed">
                        {product.description || "Son stéréo HD, autonomie 30h, confort premium pour vos longues sessions."}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-end gap-3">
                        <span className="text-slate-900 font-black text-2xl tracking-tight">{price ? `${price} DH` : 'N/A'}</span>
                        {discount > 0 && priceDisplay && (
                          <span className="text-slate-400 line-through text-sm font-medium mb-1.5">{priceDisplay} DH</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={16} fill="currentColor" strokeWidth={0} className="text-amber-400" />
                        <span className="text-slate-600 text-sm font-bold">{product.rating || '5.0'}</span>
                        <span className="text-slate-400 text-sm">({product.reviews || '0'})</span>
                      </div>
                    </div>
                    <Link
                      href={`/product/${product.slug || product.id}`}
                      className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-transparent font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2 cursor-pointer"
                    >
                      <ShoppingBag size={20} className="group-hover/btn:scale-110 transition-transform" />
                      {t.product?.orderNow || t.home?.buy || 'Acheter maintenant'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
              <div className="text-center text-slate-500 italic">
                Aucun avis disponible pour le moment.
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="max-w-[1000px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight mb-4">Questions Fréquentes</h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur nos produits et services.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <details className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Comment passer une commande ?
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">
                  Choisissez simplement le produit que vous souhaitez, ajoutez-le au panier et laissez-vous guider. Vous pourrez finaliser votre commande en quelques clics en renseignant votre adresse de livraison complète.
                </div>
              </details>

              <details className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Quels sont les délais de livraison au Maroc ?
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">
                  Nos délais de livraison habituels sont de 24 à 48 heures ouvrées selon votre ville. Nous expédions rapidement pour que votre commande puisse vous satisfaire le plus vite possible.
                </div>
              </details>

              <details className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Est-ce que vous livrez partout au Maroc ?
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">
                  Oui, absolument. Nous assurons la livraison vers toutes les régions et villes du Maroc, de Casablanca jusqu`aux régions les plus éloignées de Tanger et Dakhla.
                </div>
              </details>

              <details className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Comment suivre ma commande ?
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">
                  Dès que votre colis est expédié, vous pouvez suivre son état sur l&apos;interface ou via notre équipe Support sur WhatsApp qui est là pour vous assister.
                </div>
              </details>

              <details className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Quelle est votre politique de retour ?
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">
                  Nous proposons des retours acceptés sous 7 jours sans questions si le produit ne correspond pas ou présente une anomalie. Les articles doivent nous être retournés intacts.
                </div>
              </details>

              <details className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <summary className="flex items-center justify-between font-bold text-slate-900 p-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  Acceptez-vous le paiement à la livraison ?
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="text-slate-600 px-6 pb-6 pt-0 leading-relaxed border-t border-slate-100/50 mt-2">
                  Oui ! Pour vous offrir une expérience d&apos;achat sécurisée, vous pouvez payer votre commande en espèces (Cash on Delivery) et sans carte bancaire de main en main au livreur.
                </div>
              </details>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
