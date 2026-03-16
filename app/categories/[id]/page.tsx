'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { use, useState, useMemo } from 'react';
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

  // Filter States
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<string>('popular');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    // First map to category
    let result = products.filter(p => p.category === id);

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand || ''));
    }

    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    if (inStockOnly && !outOfStockOnly) {
      result = result.filter(p => p.inStock);
    } else if (outOfStockOnly && !inStockOnly) {
      result = result.filter(p => !p.inStock);
    }

    switch (sortOrder) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.reverse();
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, id, selectedBrands, minPrice, maxPrice, inStockOnly, outOfStockOnly, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-white dark:bg-slate-950 py-10">
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
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="popular">{t.shop.sort.popular}</option>
                <option value="newest">{t.shop.sort.newest}</option>
                <option value="price-low">{t.shop.sort.priceLow}</option>
                <option value="price-high">{t.shop.sort.priceHigh}</option>
              </select>
              <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden w-11 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300"
              >
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
                  <button onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">{t.shop.filters.reset}</button>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.shop.filters.price}</h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder={t.shop.filters.min} 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary" 
                    />
                    <span className="text-slate-400">-</span>
                    <input 
                      type="number" 
                      placeholder={t.shop.filters.max} 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary" 
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.shop.filters.brand}</h4>
                  <div className="flex flex-col gap-3">
                    {['Notch', 'Anker', 'Baseus'].map((brand) => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandChange(brand)}
                          className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                        />
                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4">{t.shop.filters.availability}</h4>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                      />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t.shop.filters.inStock}</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={outOfStockOnly}
                        onChange={(e) => setOutOfStockOnly(e.target.checked)}
                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" 
                      />
                      <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{t.shop.filters.outOfStock}</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4">search_off</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucun produit trouvé</h3>
                    <p className="text-slate-500 max-w-md">Essayez de modifier vos filtres pour trouver ce que vous cherchez.</p>
                    <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-amber-500 transition-colors">
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  paginatedProducts.map((product) => (
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
                )))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {getPageNumbers().map((page, idx) =>
                      page === '...' ? (
                        <span key={`dots-${idx}`} className="text-slate-400 px-2">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            currentPage === page
                              ? 'bg-primary text-white shadow-md shadow-primary/20'
                              : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
