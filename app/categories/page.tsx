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
      name: t.categories.items.powerBanks.name,
      description: t.categories.items.powerBanks.desc,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcjE3d3CjD6i2E0XIvPZUVdgE0O5PvMnAWj45MK19UAOQNXZCfVbWvXttS1Ni6zStfyVB4pU_J4P7j2FRdQeYflGq_D-I5wlId8b_z8O-T3TJogBvRN6S9L-M4BhlgAL8Yfp1wO6cf8ko9rYoZu11Hoger7FxqEJCM1qjgIziwjTVsOJYFJM5c0rPqg75KmGYS-LFSYjfVl4b67urTeW2g9NacFd6xhrNrZINHeYk3gCWw0Xf9Wtekj8QcsNnU2ZKA-ikHRUzcsAfG',
      itemCount: 15
    },
    {
      id: 'chargeurs',
      name: t.categories.items.chargeurs.name,
      description: t.categories.items.chargeurs.desc,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD',
      itemCount: 24
    },
    {
      id: 'cables',
      name: t.categories.items.cables.name,
      description: t.categories.items.cables.desc,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM9pXG2JOOngvqdudDIysGjRL0czJwD08aNiX4L9KwOLs1I4vGcJHzzGLP2KDLjas49w7hE0UudVZEexExOsB9oY9a0U6JEAdkd_PwAxwKvsYF8PiWH8JaBL-N3VgAKjV8AEhljeUMUww8vZPXlk0Alu4nWVhk8HAGPq4AAaHN8Af6TT_MKjIXR-kutYg-WXjksoGXcxRe1sAKDYscK0D44HE2o1hA3WYp2F6o73h46sa4q_Lwrf8U8JG3-B6GqQbwZi1evPSoeX0D',
      itemCount: 42
    },
    {
      id: 'audio',
      name: t.categories.items.audio.name,
      description: t.categories.items.audio.desc,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWlut6sOSGm2cooiTBkNpZBCKlJPcaYL2kS1vUVC73ilSi66yIYSH8whcEQrDUecXT8m3bkJo_3qNXtyRG9K84gZ00ZlviqjPTiKW8p4PV_Ona3yHeGGYcp8AEqnTChusAHJmLoGFvWNHX8pgfOKHBBDCWqqeuaMDj2dWPCws7xdsALaj6q2PpZcMNnDk1AnGoK1iJ7vQUAMQYSyRNRDTst0ip7jgD8G3M_9V-m9FlQK6xeqZ0wVquvBuTbbfPaqr926BMEwROMkAQ',
      itemCount: 18
    },
    {
      id: 'accessoires-voiture',
      name: t.categories.items.accessoiresVoiture.name,
      description: t.categories.items.accessoiresVoiture.desc,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD',
      itemCount: 12
    },
    {
      id: 'protection',
      name: t.categories.items.protection.name,
      description: t.categories.items.protection.desc,
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
              <Link key={category.id} href={`/categories/${category.id}`} className="group relative flex flex-col bg-slate-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 aspect-[4/3]">
                <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${category.image}')` }}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500 z-10"></div>
                
                <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
                  <h2 className="text-3xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight drop-shadow-lg">{category.name}</h2>
                  <p className="text-white/90 font-medium leading-relaxed mb-6 max-w-sm drop-shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">{category.description}</p>
                  
                  <div className="flex items-center gap-2 bg-white/20 hover:bg-primary text-white backdrop-blur-md border border-white/30 font-bold px-6 py-3 rounded-full transition-all duration-300 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 delay-200 shadow-lg">
                    {t.categories.explore}
                    <span className="material-symbols-outlined rtl:rotate-180 text-sm">arrow_forward</span>
                  </div>
                </div>
                
                <div className="absolute top-6 right-6 z-20 bg-black/40 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-white/20">
                  {category.itemCount} {t.categories.products}
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
