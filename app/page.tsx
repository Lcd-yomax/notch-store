'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';
import HeroSlider from '@/components/HeroSlider';
import CategorySlider from '@/components/CategorySlider';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestSellingProducts from '@/components/BestSellingProducts';
import { shopProducts } from '@/lib/dummyData';

export default function Home() {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  return (
    <>
      <Header />
      <main className="flex-grow">
        <HeroSlider />

        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-800/50 shadow-xl">
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">{t.home.fastDelivery}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.home.fastDeliveryDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">payments</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">{t.home.cod}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.home.codDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors group">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">{t.home.quality}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t.home.qualityDesc}</p>
              </div>
            </div>
          </div>
        </section>

        <CategorySlider />
        <BestSellingProducts />
        <FeaturedProducts />

        <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-2">{t.home.latestPromos}</h2>
              <p className="text-slate-500 text-lg font-medium">{t.home.latestPromosDesc}</p>
            </div>
            <Link href="#" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              {t.home.seeAll}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopProducts.slice(0, 4).map((product) => {
              // Resolve localized names for the products
              const keys = product.nameKey.split('.');
              let currentName: any = t;
              for (const key of keys) {
                if (currentName && currentName[key] !== undefined) {
                  currentName = currentName[key];
                } else {
                  currentName = product.nameKey;
                  break;
                }
              }
              const productName = typeof currentName === 'string' ? currentName : product.nameKey;

              return (
                <div key={product.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                      -{product.discount}%
                    </div>
                  )}
                  <Link href={`/product/${product.id}`} className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-slate-900/50 overflow-hidden block">
                    <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 group-hover:opacity-0" style={{ backgroundImage: `url('${product.image}')` }}></div>
                    {product.hoverImage && (
                      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110" style={{ backgroundImage: `url('${product.hoverImage}')` }}></div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow gap-4">
                    <div>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">{productName}</h3>
                      </Link>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto">
                      <div className="flex items-end gap-3">
                        <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tight">{product.price} DH</span>
                        {product.originalPrice && (
                          <span className="text-slate-400 line-through text-sm font-medium mb-1.5">{product.originalPrice} DH</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-slate-600 dark:text-slate-400 text-sm font-bold">{product.rating}</span>
                        <span className="text-slate-400 text-sm">({product.reviews})</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: productName,
                          price: product.price,
                          quantity: 1,
                          image: product.image
                        });
                      }}
                      className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-transparent font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl group-hover/btn:scale-110 transition-transform">shopping_cart</span>
                      {t.home.buy}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800 py-20">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-4">{t.home.reviewsTitle}</h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.home.reviewsDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined absolute -top-2 -right-2 text-slate-100 dark:text-slate-700/30 text-8xl rotate-12 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6 text-amber-400">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">&quot;Le chargeur 65W a vraiment changé ma vie, il charge mon ordinateur portable et mon téléphone à une vitesse incroyable. La livraison a été très rapide et le produit est original et excellent.&quot;</p>
                  <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">A.M</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Abdo</h4>
                      <span className="text-sm text-slate-500">{t.home.verifiedCustomer}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined absolute -top-2 -right-2 text-slate-100 dark:text-slate-700/30 text-8xl rotate-12 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6 text-amber-400">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">&quot;Le power bank est de très haute qualité et suffit pour des jours de charge. L&apos;emballage était professionnel et l&apos;expérience d&apos;achat sur le site est facile et pratique.&quot;</p>
                  <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">A.E</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Ahlam</h4>
                      <span className="text-sm text-slate-500">{t.home.verifiedCustomer}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined absolute -top-2 -right-2 text-slate-100 dark:text-slate-700/30 text-8xl rotate-12 pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6 text-amber-400">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">&quot;Le câble est très solide et a l&apos;air de durer. Leur service client est excellent et a répondu à mes questions rapidement. Je recommande vivement de faire affaire avec eux.&quot;</p>
                  <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">K.B</div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Karim Bennani</h4>
                      <span className="text-sm text-slate-500">{t.home.verifiedCustomer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
