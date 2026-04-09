'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ShippingPolicyPage() {
  const { t } = useLanguage();
  const lp = t.legalPages;
  const s = lp.shipping;

  const infoCards = [
    { icon: 'local_shipping', label: s.cardDelivery, value: s.cardDeliveryValue },
    { icon: 'payments', label: s.cardFees, value: s.cardFeesValue },
    { icon: 'location_on', label: s.cardZone, value: s.cardZoneValue },
  ];

  const tableRows = [
    { zone: s.tableRow1Zone, delay: s.tableRow1Delay },
    { zone: s.tableRow2Zone, delay: s.tableRow2Delay },
    { zone: s.tableRow3Zone, delay: s.tableRow3Delay },
    { zone: s.tableRow4Zone, delay: s.tableRow4Delay },
  ];

  return (
    <>
      <Header />
      <main className="flex-grow bg-white py-14">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">

          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-10">
            <Link href="/" className="hover:text-primary transition-colors">{lp.breadcrumbHome}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <span className="text-slate-900">{s.breadcrumb}</span>
          </nav>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm px-4 py-2 rounded-full mb-4">
              <span className="material-symbols-outlined text-sm">local_shipping</span>
              {lp.legalDocsBadge}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">{s.title}</h1>
            <p className="text-slate-500 text-lg">{lp.lastUpdated}</p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {infoCards.map((card) => (
              <div key={card.label} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="material-symbols-outlined text-primary text-3xl mb-2">{card.icon}</span>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-lg font-black text-slate-900">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed">

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">1</span>
                {s.s1Title}
              </h2>
              <div className="ps-11 space-y-3"><p>{s.s1p1}</p></div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">2</span>
                {s.s2Title}
              </h2>
              <div className="ps-11 space-y-3">
                <p>{s.s2p1}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse mt-2">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-start px-4 py-3 rounded-ts-xl font-bold text-slate-900">{s.tableCol1}</th>
                        <th className="text-start px-4 py-3 rounded-te-xl font-bold text-slate-900">{s.tableCol2}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, i) => (
                        <tr key={i} className="border-t border-slate-200">
                          <td className="px-4 py-3 text-slate-600">{row.zone}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{row.delay}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-slate-500 mt-2">{s.tableNote}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">3</span>
                {s.s3Title}
              </h2>
              <div className="ps-11 space-y-3"><p>{s.s3p1}</p><p>{s.s3p2}</p></div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">4</span>
                {s.s4Title}
              </h2>
              <div className="ps-11 space-y-3">
                <p>{s.s4p1}</p>
                <ul className="list-none space-y-2">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">chat</span> WhatsApp : +212 667-018042</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">mail</span> contact@notchmaroc.ma</li>
                </ul>
              </div>
            </section>

            <section id="retours">
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">5</span>
                {s.s5Title}
              </h2>
              <div className="ps-11 space-y-3"><p>{s.s5p1}</p><p>{s.s5p2}</p></div>
            </section>

            {/* CTA */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col sm:flex-row items-center gap-6 mt-12">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined text-3xl">support_agent</span>
              </div>
              <div className="text-center sm:text-start">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{s.ctaTitle}</h3>
                <p className="text-slate-500 text-sm">{s.ctaDesc}</p>
              </div>
              <Link href="/contact" className="sm:ms-auto flex-shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300">
                {lp.contactUs}
                <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
