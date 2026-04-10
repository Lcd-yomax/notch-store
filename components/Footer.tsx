'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t-4 border-primary mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/images/logo/logo-dark.png"
                alt="Notch Logo"
                width={160}
                height={120}
                style={{ height: '170px', width: 'auto' }}
                className="w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed mb-8">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/notchtech.ma" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Facebook" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#1877F2] transition-all hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/notchtech_ma" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#E4405F] transition-all hover:scale-110">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.footer.quickLinks}</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.header.about}</Link></li>
              <li><Link href="/shop" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.newProducts}</Link></li>
              <li><Link href="/shop" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.specialOffers}</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.orderTracking}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.footer.policies}</h4>
            <ul className="space-y-4">
              <li><Link href="/politique-expedition" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.shippingPolicy}</Link></li>
              <li><Link href="/politique-expedition#retours" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.returnPolicy}</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.terms}</Link></li>
              <li><Link href="/politique-confidentialite" className="text-slate-400 hover:text-primary transition-colors font-medium">{t.footer.privacy}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6">{t.footer.contactUs}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <span className="material-symbols-outlined text-primary">call</span>
                <span dir="ltr">+212 667-018042</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span>contact@notch-tech.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium">{t.footer.rights}</p>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="material-symbols-outlined text-3xl">credit_card</span>
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
