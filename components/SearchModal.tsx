'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

// Mock products for search suggestions
const mockProducts = [
  {
    id: '1',
    name: 'Chargeur NOTCH 65W GaN Ultra Rapide',
    price: 249,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD'
  },
  {
    id: '2',
    name: 'Powerbank NOTCH 20000mAh Fast Charge',
    price: 399,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6-PzCy-47LExPVhmTpGvqDvHJUT1yoa4NhJQjSOSss0A1pImJFnSU1Zlrd0GHIwA7qSOJixW8WIxQYzleF2l7dpIqCeXdfuteZeViu9RchJuRyveHuLj0EV6l3fayAaCZlybMeJ_nh8lwjKCiqJEBOVW9HHMYW_IYhs5lvPzHgLnzvJHstCornVqsEx7QlLMQrb4xja4WxozWpAGanngGnZjMLdjpccnZPYEEEMXnOe61dtmyCIJi6YvAFPDf7tCJ8ojRBsoiT1Sb'
  },
  {
    id: '3',
    name: 'Câble Type-C NOTCH 100W Tressé',
    price: 99,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM9pXG2JOOngvqdudDIysGjRL0czJwD08aNiX4L9KwOLs1I4vGcJHzzGLP2KDLjas49w7hE0UudVZEexExOsB9oY9a0U6JEAdkd_PwAxwKvsYF8PiWH8JaBL-N3VgAKjV8AEhljeUMUww8vZPXlk0Alu4nWVhk8HAGPq4AAaHN8Af6TT_MKjIXR-kutYg-WXjksoGXcxRe1sAKDYscK0D44HE2o1hA3WYp2F6o73h46sa4q_Lwrf8U8JG3-B6GqQbwZi1evPSoeX0D'
  },
  {
    id: '4',
    name: 'Écouteurs Sans Fil NOTCH Pro ANC',
    price: 299,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWlut6sOSGm2cooiTBkNpZBCKlJPcaYL2kS1vUVC73ilSi66yIYSH8whcEQrDUecXT8m3bkJo_3qNXtyRG9K84gZ00ZlviqjPTiKW8p4PV_Ona3yHeGGYcp8AEqnTChusAHJmLoGFvWNHX8pgfOKHBBDCWqqeuaMDj2dWPCws7xdsALaj6q2PpZcMNnDk1AnGoK1iJ7vQUAMQYSyRNRDTst0ip7jgD8G3M_9V-m9FlQK6xeqZ0wVquvBuTbbfPaqr926BMEwROMkAQ'
  }
];

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim() === '' 
    ? [] 
    : mockProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:px-6">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 p-4">
          <span className="material-symbols-outlined text-slate-400 mr-3">search</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
            placeholder={t.header.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search</span>
              <p>{t.header.searchTitle}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                {t.header.searchTitle}
              </h3>
              <div className="grid gap-4">
                {results.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative flex-shrink-0">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover mix-blend-multiply dark:mix-blend-normal"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-primary font-bold mt-1">{product.price} DH</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">
                      {language === 'ar' ? 'chevron_left' : 'chevron_right'}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-primary font-bold hover:underline text-sm" onClick={handleClose}>
                  {t.header.viewAll}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">sentiment_dissatisfied</span>
              <p>{t.header.noResults}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
