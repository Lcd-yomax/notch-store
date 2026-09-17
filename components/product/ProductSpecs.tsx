'use client';

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

/** Full specification table, grouped by group_name and ordered by sort_order. */
export function SpecsTable({ specs }: { specs: ProductSpec[] }) {
  const { t, language } = useLanguage();
  if (specs.length === 0) return null;
  const groupName = (name: string) => (language === 'ar' ? t.phone.specGroups[name] ?? name : name);

  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">memory</span>
        {t.phone.specsTitle}
      </h3>
      <div className="flex flex-col gap-6">
        {groupSpecs(specs).map((group) => (
          <div key={group.name} className="rounded-2xl border border-slate-200 overflow-hidden">
            <h4 className="bg-slate-50 px-4 py-3 font-bold text-slate-900 border-b border-slate-200">{groupName(group.name)}</h4>
            <table className="w-full text-sm">
              <tbody>
                {group.items.map((spec, idx) => {
                  const { label, value } = localizeSpec(spec, language);
                  return (
                    <tr key={`${spec.label}-${idx}`} className="border-b border-slate-100 last:border-0">
                      <th scope="row" className="w-2/5 px-4 py-3 text-start font-medium text-slate-500 align-top">{label}</th>
                      <td className="px-4 py-3 text-slate-900 font-medium">{value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
