'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();
  const lp = t.legalPages;
  const s = lp.privacy;

  const sections = [
    {
      num: '1', title: s.s1Title,
      content: <><p>{s.s1p1}</p><ul className="list-disc list-inside space-y-2"><li>{s.s1b1}</li><li>{s.s1b2}</li><li>{s.s1b3}</li></ul></>
    },
    {
      num: '2', title: s.s2Title,
      content: <><p>{s.s2p1}</p><ul className="list-disc list-inside space-y-2"><li>{s.s2b1}</li><li>{s.s2b2}</li><li>{s.s2b3}</li><li>{s.s2b4}</li></ul></>
    },
    { num: '3', title: s.s3Title, content: <><p>{s.s3p1}</p></> },
    { num: '4', title: s.s4Title, content: <><p>{s.s4p1}</p><p>{s.s4p2}</p></> },
    { num: '5', title: s.s5Title, content: <><p>{s.s5p1}</p></> },
    { num: '6', title: s.s6Title, content: <><p>{s.s6p1}</p></> },
    {
      num: '7', title: s.s7Title,
      content: (
        <>
          <p>{s.s7p1}</p>
          <ul className="list-none space-y-2">
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">mail</span> contact@notchmaroc.ma</li>
            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base">call</span> +212 667-018042</li>
          </ul>
        </>
      )
    },
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
              <span className="material-symbols-outlined text-sm">shield</span>
              {lp.legalDocsBadge}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">{s.title}</h1>
            <p className="text-slate-500 text-lg">{lp.lastUpdated}</p>
          </div>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.num}>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black flex-shrink-0">{section.num}</span>
                  {section.title}
                </h2>
                <div className="pl-11 text-slate-600 leading-relaxed space-y-3">
                  {section.content}
                </div>
              </section>
            ))}

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
