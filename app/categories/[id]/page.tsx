'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { use } from 'react';
import { useCart } from '@/lib/CartContext';
import { shopProducts } from '@/lib/dummyData';

export default function CategoryDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const { addToCart } = useCart();
  
  // Try to get the translated category name if it exists, otherwise fallback to formatting the id
  const categoryKey = id.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
  const categoryName = t.categories.items[categoryKey as keyof typeof t.categories.items]?.name || 
    id.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Map the product list and fetch translated names
  const products = shopProducts.map(p => {
    const keys = p.nameKey.split('.');
    let currentName: any = t;
    for (const key of keys) {
      if (currentName && currentName[key] !== undefined) {
        currentName = currentName[key];
      } else {
        currentName = p.nameKey;
        break;
      }
    }
    return { ...p, name: typeof currentName === 'string' ? currentName : p.nameKey };
  });

  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.header.home}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <Link href="/categories" className="hover:text-primary transition-colors">{t.header.categories}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <span className="text-slate-900 dark:text-white">{categoryName}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{categoryName}</h1>
              <p className="text-slate-500 text-lg font-medium">{t.shop.desc}</p>
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer">
                <option value="popular">{t.shop.sort.popular}</option>
                <option value="newest">{t.shop.sort.newest}</option>
                <option value="price-low">{t.shop.sort.priceLow}</option>
                <option value="price-high">{t.shop.sort.priceHigh}</option>
              </select>
              <button className="md:hidden w-11 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Filters Sidebar (Desktop) */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t.shop.filters.title}</h3>
                  <button className="text-sm font-medium text-primary hover:underline">{t.shop.filters.reset}</button>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.shop.filters.price}</h4>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
                    <span className="text-slate-400">-</span>
                    <input type="number" placeholder="Max" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.shop.filters.brand}</h4>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" defaultChecked />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Notch (15)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Anker (8)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Baseus (12)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.shop.filters.availability}</h4>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" defaultChecked />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t.shop.filters.inStock} (32)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t.shop.filters.outOfStock} (3)</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative">
                    {product.discount > 0 && (
                      <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                        -{product.discount}%
                      </div>
                    )}
                    <Link href={`/product/${product.id}`} className="relative w-full aspect-[4/3] bg-slate-50 dark:bg-slate-900/50 overflow-hidden block">
                      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 group-hover:opacity-0" style={{ backgroundImage: `url('${product.image}')` }}></div>
                      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-110" style={{ backgroundImage: `url('${product.hoverImage}')` }}></div>
                    </Link>
                    <div className="p-6 flex flex-col flex-grow gap-4">
                      <div>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-snug line-clamp-2 hover:text-primary transition-colors mb-2">{product.name}</h3>
                        </Link>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex items-end gap-3">
                          <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tight">{product.price} DH</span>
                          {product.originalPrice > product.price && (
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
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.image
                          });
                        }}
                        className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white border border-transparent font-bold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn mt-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-xl group-hover/btn:scale-110 transition-transform">shopping_cart</span>
                        {t.product.addToCart}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center shadow-md shadow-primary/20">1</button>
                  <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-colors font-bold">2</button>
                  <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-colors font-bold">3</button>
                  <span className="text-slate-400 px-2">...</span>
                  <button className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
