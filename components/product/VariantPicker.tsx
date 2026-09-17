'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { PublicVariation } from '@/lib/catalog/types';
import { formatStorage, optionsFor, type Dimension, type Selection } from '@/lib/catalog/variants';
import type { Condition } from '@/lib/catalog/types';

interface Props {
  variations: PublicVariation[];
  dimensions: Dimension[];
  selection: Selection;
  onSelect: (index: number, value: string | number) => void;
}

export default function VariantPicker({ variations, dimensions, selection, onSelect }: Props) {
  const { t } = useLanguage();

  const titles: Record<Dimension, string> = {
    storage_gb: t.phone.storage,
    color: t.product.color,
    condition: t.phone.condition,
    size: t.product.size,
  };

  const label = (dimension: Dimension, value: string | number) => {
    if (dimension === 'storage_gb') return formatStorage(Number(value), t.phone.units);
    if (dimension === 'condition') return t.phone.conditions[value as Condition] ?? String(value);
    return String(value);
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      {dimensions.map((dimension, index) => {
        const options = optionsFor(variations, dimensions, selection, index);
        // Condition is only worth asking when there is a real choice
        if (options.length === 0 || (dimension === 'condition' && options.length < 2)) return null;
        const selected = selection[dimension];

        return (
          <div key={dimension} role="radiogroup" aria-label={titles[dimension]}>
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
              {titles[dimension]}
              {selected != null && (
                <>
                  : <span className="text-slate-500 font-normal normal-case">{label(dimension, selected)}</span>
                </>
              )}
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {options.map((option) => {
                const isSelected = option.value === selected;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!option.inStock}
                    onClick={() => onSelect(index, option.value)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                      isSelected
                        ? 'border-primary text-primary bg-primary/5 shadow-sm'
                        : !option.inStock
                          ? 'border-dashed border-slate-200 text-slate-300 cursor-not-allowed'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    <span dir={dimension === 'storage_gb' ? 'ltr' : undefined}>{label(dimension, option.value)}</span>
                    {!option.inStock && (
                      <span className="block text-[10px] font-normal leading-none mt-1 text-red-400">{t.product.soldOut}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
