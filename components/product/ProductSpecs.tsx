'use client';

import { useId, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { ProductSpec } from '@/lib/catalog/types';
import { groupSpecs, keySpecsOf, localizeSpec, type KeySpecKey } from '@/lib/catalog/variants';

const KEY_SPEC_ICONS: Record<KeySpecKey, string> = {
  screen: 'smartphone',
  battery: 'battery_full',
  camera: 'photo_camera',
  network: 'signal_cellular_alt',
};

/** Screen / battery / camera / network summary shown near the top of a phone page. */
export function KeySpecs({ specs }: { specs: ProductSpec[] }) {
  const { t, language } = useLanguage();
  const keySpecs = keySpecsOf(specs);
  if (keySpecs.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">{t.phone.keySpecs.title}</h2>
      <dl className="grid grid-cols-2 gap-3">
        {keySpecs.map(({ key, spec }) => (
          <div key={key} className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <span className="material-symbols-outlined text-primary text-2xl shrink-0">{KEY_SPEC_ICONS[key]}</span>
            <div className="min-w-0">
              <dt className="text-xs font-bold text-slate-500">{t.phone.keySpecs[key]}</dt>
              <dd className="text-sm font-bold text-slate-900 break-words">{localizeSpec(spec, language).value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Full specification sheet, grouped by group_name and ordered by sort_order.
 * Collapsed by default, like the description accordion above it.
 */
export function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  if (specs.length === 0) return null;

  // Group names are stored in French; each dictionary maps the ones it translates.
  const groupName = (name: string) => t.phone.specGroups[name] ?? name;
  const groups = groupSpecs(specs);

  return (
    <section className="mb-8 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 py-4 group cursor-pointer text-start"
      >
        <span className="min-w-0">
          <span className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">memory</span>
            {t.phone.specsTitle}
          </span>
          {!isOpen && (
            <span className="block mt-1 ps-8 text-sm text-slate-400 truncate">
              {groups.map((group) => groupName(group.name)).join(' · ')}
            </span>
          )}
        </span>
        <span
          className={`material-symbols-outlined shrink-0 text-slate-400 group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pt-2 pb-2">
            {groups.map((group) => (
              <div key={group.name} className="pt-6 first:pt-0">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-900">
                  {groupName(group.name)}
                </h4>
                <dl>
                  {group.items.map((spec, idx) => {
                    const { label, value } = localizeSpec(spec, language);
                    return (
                      <div
                        key={`${spec.label}-${idx}`}
                        className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 py-3 border-b border-slate-100 text-sm"
                      >
                        <dt className="text-slate-500">{label}</dt>
                        <dd className="text-slate-900 font-medium break-words">{value}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
