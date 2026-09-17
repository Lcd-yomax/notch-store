'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhoneSpotlight from '@/components/PhoneSpotlight';
import ProductCard from '@/components/ProductCard';
import ListingFilters, { type FilterOverrides } from './ListingFilters';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { fill } from '@/lib/i18n/format';
import type { ListingFacets, ListingFilters as Filters } from '@/lib/catalog/queries';
import type { Brand, CardProduct, CategoryRef } from '@/lib/catalog/types';

interface Props {
  kind: 'shop' | 'category' | 'brand';
  /** Category or brand name (unused for the shop). */
  name?: string;
  products: CardProduct[];
  total: number;
  totalPages: number;
  filters: Filters;
  facets: ListingFacets;
  categories?: CategoryRef[];
  showPhoneFilters: boolean;
  showBrandFilter: boolean;
  brandLogos?: Brand[];
}

function toQueryString(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.brands.length) params.set('brand', filters.brands.join(','));
  if (filters.storages.length) params.set('storage', filters.storages.join(','));
  if (filters.rams.length) params.set('ram', filters.rams.join(','));
  if (filters.conditions.length) params.set('condition', filters.conditions.join(','));
  if (filters.inStock) params.set('stock', '1');
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice));
  if (filters.sort !== 'popular') params.set('sort', filters.sort);
  if (filters.page > 1) params.set('page', String(filters.page));
  return params.toString();
}

export default function ProductListing({
  kind,
  name,
  products,
  total,
  totalPages,
  filters,
  facets,
  categories,
  showPhoneFilters,
  showBrandFilter,
  brandLogos,
}: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const navigate = (next: Filters, scrollTop = false) => {
    const qs = toQueryString(next);
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
    if (scrollTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Any filter change goes back to page 1
  const applyFilters = (overrides: FilterOverrides) => navigate({ ...filters, ...overrides, page: 1 });
  const resetFilters = () => {
    setIsDrawerOpen(false);
    navigate({ ...filters, category: '', brands: [], storages: [], rams: [], conditions: [], inStock: false, minPrice: null, maxPrice: null, page: 1 });
  };
  const goToPage = (page: number) => navigate({ ...filters, page }, true);

  const title = kind === 'shop' ? t.shop.title : name;
  const description = kind === 'brand' ? fill(t.listing.brandDesc, { brand: name ?? '' }) : t.shop.desc;

  const pageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const current = filters.page;
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
      if (current < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const filterPanel = (
    <ListingFilters
      key={`${filters.minPrice}-${filters.maxPrice}`}
      filters={filters}
      facets={facets}
      categories={categories}
      showPhoneFilters={showPhoneFilters}
      showBrandFilter={showBrandFilter}
      onChange={applyFilters}
      onReset={resetFilters}
    />
  );

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.header.home}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            {kind === 'shop' ? (
              <span className="text-slate-900">{t.header.shop}</span>
            ) : (
              <>
                <Link href={kind === 'category' ? '/categories' : '/shop'} className="hover:text-primary transition-colors">
                  {kind === 'category' ? t.header.categories : t.header.shop}
                </Link>
                <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
                <span className="text-slate-900">{name}</span>
              </>
            )}
          </nav>

          {kind === 'category' && pathname === '/categories/smartphones' && <PhoneSpotlight />}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">{title}</h1>
              <p className="text-slate-500 text-lg font-medium">{description}</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filters.sort}
                onChange={(e) => navigate({ ...filters, sort: e.target.value as Filters['sort'], page: 1 })}
                aria-label={t.categories.sortBy}
                className="flex-1 md:flex-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="popular">{t.shop.sort.popular}</option>
                <option value="newest">{t.shop.sort.newest}</option>
                <option value="price-low">{t.shop.sort.priceLow}</option>
                <option value="price-high">{t.shop.sort.priceHigh}</option>
              </select>
              <button
                onClick={() => setIsDrawerOpen(true)}
                aria-label={t.shop.filters.title}
                className="md:hidden w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </div>

          {brandLogos && brandLogos.length > 0 && (
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">{t.phone.brands}</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {brandLogos.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/marque/${brand.slug}`}
                    className="shrink-0 h-16 min-w-[120px] px-5 rounded-2xl border border-slate-200 bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all flex items-center justify-center"
                  >
                    {brand.logo_url ? (
                      <Image src={brand.logo_url} alt={brand.name} width={96} height={40} className="h-10 w-auto object-contain" />
                    ) : (
                      <span className="font-black text-slate-800">{brand.name}</span>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex gap-8">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-32">{filterPanel}</div>
            </aside>

            <div className={`flex-grow transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`} aria-busy={isPending}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t.listing.noProducts}</h3>
                    <p className="text-slate-500 max-w-md">{t.listing.noProductsDesc}</p>
                    <button
                      onClick={resetFilters}
                      className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-amber-500 transition-colors cursor-pointer"
                    >
                      {t.listing.resetFilters}
                    </button>
                  </div>
                ) : (
                  products.map((product) => <ProductCard key={product.id} product={product} showRating={kind === 'category'} />)
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className="material-symbols-outlined rtl:rotate-180">chevron_left</span>
                    </button>
                    {pageNumbers().map((page, idx) =>
                      page === '...' ? (
                        <span key={`dots-${idx}`} className="text-slate-400 px-1">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            filters.page === page
                              ? 'bg-primary text-white shadow-lg shadow-primary/30'
                              : 'border border-slate-200 text-slate-600 hover:text-primary hover:border-primary'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => goToPage(Math.min(totalPages, filters.page + 1))}
                      disabled={filters.page === totalPages}
                      className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className="material-symbols-outlined rtl:rotate-180">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile filters: bottom drawer */}
      <div className={`md:hidden fixed inset-0 z-[60] ${isDrawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isDrawerOpen}>
        <div
          className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.shop.filters.title}
          className={`absolute bottom-0 inset-x-0 max-h-[85vh] flex flex-col bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div className="flex items-center justify-between px-6 pt-3 pb-2">
            <span className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" />
          </div>
          <div className="overflow-y-auto px-6 pb-6">{filterPanel}</div>
          <div className="flex gap-3 border-t border-slate-100 p-4">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 bg-primary hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-70"
              disabled={isPending}
            >
              {isPending ? (
                <span className="material-symbols-outlined animate-spin align-middle">progress_activity</span>
              ) : (
                `${t.listing.showResults} (${total})`
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
