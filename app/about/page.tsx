'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{t.about.title}</h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.about.subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
            <div className="flex flex-col justify-center gap-6">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t.about.storyTitle}</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {t.about.storyP1}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {t.about.storyP2}
              </p>
            </div>
            <div className="relative w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkGl-5rC2EZpGUTMTnmRZZR-J837V8RUD4OqDE_CXhYKHS6TRCANb-PCTK2D65OHFecUcRCBnlzESqi5UPSPb6Wj2cUzThsjPQ6MFlf6sQiaW2qF4xeC1sGPvn0tOAWy04_HoLyOXqsVsObPj6ZLfwEFMzeMyiEP19OeQtvxTDSdINlIqdG2HPlYox5E4_5aJ_sqCC-WwxXhqz6fMVw0aQ9kgc32C57UBleMBHH2Iv0_ZRcz1Bl8P4qtof5X3RtvcxbYdXTKgL5XcF')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-white text-2xl font-bold mb-2">L&apos;équipe NotchMaroc</h3>
                <p className="text-slate-300 font-medium">Dédiée à vous offrir la meilleure expérience technologique.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 lg:p-20 shadow-sm mb-24">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{t.about.valuesTitle}</h2>
              <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Les principes qui guident chaque décision que nous prenons.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl">verified</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.about.value1Title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.about.value1Desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl">support_agent</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.about.value2Title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.about.value2Desc}</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t.about.value3Title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{t.about.value3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 px-8 py-16 lg:py-24 flex flex-col items-center text-center">
              <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-6 max-w-3xl">{t.about.ctaTitle}</h2>
              <p className="text-white/80 text-lg lg:text-xl font-medium max-w-2xl mb-10">{t.about.ctaDesc}</p>
              <Link href="/categories" className="bg-white text-primary hover:bg-slate-100 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center gap-3">
                {t.about.ctaButton}
                <span className="material-symbols-outlined text-xl rtl:rotate-180">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
