'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Categories() {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'power-banks',
      name: 'Power Banks',
      description: "Batteries externes haute capacité pour ne jamais manquer d'énergie.",
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcjE3d3CjD6i2E0XIvPZUVdgE0O5PvMnAWj45MK19UAOQNXZCfVbWvXttS1Ni6zStfyVB4pU_J4P7j2FRdQeYflGq_D-I5wlId8b_z8O-T3TJogBvRN6S9L-M4BhlgAL8Yfp1wO6cf8ko9rYoZu11Hoger7FxqEJCM1qjgIziwjTVsOJYFJM5c0rPqg75KmGYS-LFSYjfVl4b67urTeW2g9NacFd6xhrNrZINHeYk3gCWw0Xf9Wtekj8QcsNnU2ZKA-ikHRUzcsAfG',
      itemCount: 15
    },
    {
      id: 'chargeurs',
      name: 'Chargeurs',
      description: 'Chargeurs muraux et sans fil ultra-rapides pour tous vos appareils.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD',
      itemCount: 24
    },
    {
      id: 'cables',
      name: 'Câbles',
      description: 'Câbles de charge et de synchronisation robustes et durables.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM9pXG2JOOngvqdudDIysGjRL0czJwD08aNiX4L9KwOLs1I4vGcJHzzGLP2KDLjas49w7hE0UudVZEexExOsB9oY9a0U6JEAdkd_PwAxwKvsYF8PiWH8JaBL-N3VgAKjV8AEhljeUMUww8vZPXlk0Alu4nWVhk8HAGPq4AAaHN8Af6TT_MKjIXR-kutYg-WXjksoGXcxRe1sAKDYscK0D44HE2o1hA3WYp2F6o73h46sa4q_Lwrf8U8JG3-B6GqQbwZi1evPSoeX0D',
      itemCount: 42
    },
    {
      id: 'audio',
      name: 'Audio',
      description: 'Écouteurs sans fil, casques et enceintes Bluetooth de haute qualité.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWlut6sOSGm2cooiTBkNpZBCKlJPcaYL2kS1vUVC73ilSi66yIYSH8whcEQrDUecXT8m3bkJo_3qNXtyRG9K84gZ00ZlviqjPTiKW8p4PV_Ona3yHeGGYcp8AEqnTChusAHJmLoGFvWNHX8pgfOKHBBDCWqqeuaMDj2dWPCws7xdsALaj6q2PpZcMNnDk1AnGoK1iJ7vQUAMQYSyRNRDTst0ip7jgD8G3M_9V-m9FlQK6xeqZ0wVquvBuTbbfPaqr926BMEwROMkAQ',
      itemCount: 18
    },
    {
      id: 'accessoires-voiture',
      name: 'Accessoires Auto',
      description: 'Chargeurs allume-cigare et supports de téléphone pour voiture.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD',
      itemCount: 12
    },
    {
      id: 'protection',
      name: 'Protection',
      description: 'Coques de téléphone et verres trempés pour protéger vos appareils.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6-PzCy-47LExPVhmTpGvqDvHJUT1yoa4NhJQjSOSss0A1pImJFnSU1Zlrd0GHIwA7qSOJixW8WIxQYzleF2l7dpIqCeXdfuteZeViu9RchJuRyveHuLj0EV6l3fayAaCZlybMeJ_nh8lwjKCiqJEBOVW9HHMYW_IYhs5lvPzHgLnzvJHstCornVqsEx7QlLMQrb4xja4WxozWpAGanngGnZjMLdjpccnZPYEEEMXnOe61dtmyCIJi6YvAFPDf7tCJ8ojRBsoiT1Sb',
      itemCount: 56
    }
  ];

  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{t.categories.title}</h1>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">{t.categories.desc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300">
                <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center p-8">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url('${category.image}')` }}></div>
                  <div className="absolute bottom-4 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {category.itemCount} {t.categories.products}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{category.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow">{category.description}</p>
                  <div className="flex items-center gap-2 text-primary font-bold mt-auto group-hover:gap-3 transition-all">
                    {t.categories.explore}
                    <span className="material-symbols-outlined rtl:rotate-180">arrow_forward</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
