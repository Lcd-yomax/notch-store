'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { ListingFacets, ListingFilters as Filters } from '@/lib/catalog/queries';
import type { CategoryRef, Condition } from '@/lib/catalog/types';
import { formatStorage } from '@/lib/catalog/variants';

export type FilterOverrides = Partial<Filters>;

interface Props {
  filters: Filters;
  facets: ListingFacets;
  categories?: CategoryRef[];
  showPhoneFilters: boolean;
  showBrandFilter: boolean;
  onChange: (overrides: FilterOverrides) => void;
  onReset: () => void;
}

const toggle = <T,>(values: T[], value: T) =>
  values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

function CheckboxRow({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer shrink-0"
      />
      <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{children}</span>
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 last:mb-0">
      <h4 className="font-bold text-slate-900 mb-4">{title}</h4>
      {children}
    </div>
  );
}

export default function ListingFilters({ filters, facets, categories, showPhoneFilters, showBrandFilter, onChange, onReset }: Props) {
  const { t } = useLanguage();
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '');

  const applyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      minPrice: minPrice === '' ? null : Number(minPrice),
      maxPrice: maxPrice === '' ? null : Number(maxPrice),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 text-lg">{t.shop.filters.title}</h3>
        <button onClick={onReset} className="text-sm font-medium text-primary hover:underline cursor-pointer">
          {t.shop.filters.reset}
        </button>
      </div>

      {categories && categories.length > 0 && (
        <Section title={t.shop.filters.categories}>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => (
              <CheckboxRow
                key={cat.id}
                checked={filters.category === cat.slug}
                onChange={() => onChange({ category: filters.category === cat.slug ? '' : cat.slug })}
              >
                {cat.name}
              </CheckboxRow>
            ))}
          </div>
        </Section>
      )}

      {showBrandFilter && facets.brands.length > 0 && (
        <Section title={t.listing.brand}>
          <div className="flex max-h-48 flex-col gap-3 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin]">
            {facets.brands.map((brand) => (
              <CheckboxRow
                key={brand.id}
                checked={filters.brands.includes(brand.slug)}
                onChange={() => onChange({ brands: toggle(filters.brands, brand.slug) })}
              >
                {brand.name}
              </CheckboxRow>
            ))}
          </div>
        </Section>
      )}

      {showPhoneFilters && facets.storages.length > 0 && (
        <Section title={t.listing.storage}>
          <div className="flex flex-wrap gap-2">
            {facets.storages.map((gb) => {
              const active = filters.storages.includes(gb);
              return (
                <button
                  key={gb}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ storages: toggle(filters.storages, gb) })}
                  dir="ltr"
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer ${active ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {formatStorage(gb, t.phone.units)}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {showPhoneFilters && facets.rams.length > 0 && (
        <Section title={t.listing.ram}>
          <div className="flex flex-wrap gap-2">
            {facets.rams.map((gb) => {
              const active = filters.rams.includes(gb);
              return (
                <button
                  key={gb}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange({ rams: toggle(filters.rams, gb) })}
                  dir="ltr"
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer ${active ? 'border-primary text-primary bg-primary/5' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {formatStorage(gb, t.phone.units)}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {showPhoneFilters && facets.conditions.length > 1 && (
        <Section title={t.listing.condition}>
          <div className="flex flex-col gap-3">
            {facets.conditions.map((condition: Condition) => (
              <CheckboxRow
                key={condition}
                checked={filters.conditions.includes(condition)}
                onChange={() => onChange({ conditions: toggle(filters.conditions, condition) })}
              >
                {t.phone.conditions[condition]}
              </CheckboxRow>
            ))}
          </div>
        </Section>
      )}

      {facets.hasVisiblePrices && (
        <Section title={t.shop.filters.price}>
          <form onSubmit={applyPrice} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder={t.shop.filters.min}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                min={0}
                inputMode="numeric"
                placeholder={t.shop.filters.max}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary"
              />
            </div>
            {facets.hasPhones && <p className="text-xs text-slate-400">{t.listing.priceHint}</p>}
            <button type="submit" className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer">
              {t.listing.apply}
            </button>
          </form>
        </Section>
      )}

      <Section title={t.shop.filters.availability}>
        <CheckboxRow checked={filters.inStock} onChange={() => onChange({ inStock: !filters.inStock })}>
          {t.listing.inStockOnly}
        </CheckboxRow>
      </Section>
    </div>
  );
}
