'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { WHATSAPP_NUMBER } from '@/lib/site';

export default function PhoneSpotlight() {
  const { t } = useLanguage();
  const copy = t.phoneDiscovery;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.message)}`;

    return (
      <aside className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl bg-slate-50 border border-slate-200 p-6 mb-8">
        <div>
          <h2 className="font-bold text-lg text-slate-900">{copy.helpTitle}</h2>
          <p className="text-slate-600 mt-1">{copy.helpDesc}</p>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-3 font-bold shrink-0 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900">
          <MessageCircle size={20} aria-hidden="true" />{copy.ask}
        </a>
      </aside>
    );
}
