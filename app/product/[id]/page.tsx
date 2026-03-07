'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { use } from 'react';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  
  // Mock product data based on ID
  const product = {
    id: id,
    name: 'Chargeur NOTCH 65W GaN Ultra Rapide',
    price: 249,
    originalPrice: 349,
    discount: 30,
    rating: 4.8,
    reviews: 124,
    description: 'Chargeur mural ultra-rapide avec technologie GaN. Équipé de 2 ports USB-C et 1 port USB-A pour charger simultanément votre ordinateur portable, tablette et smartphone. Design compact et léger, idéal pour les voyages.',
    features: [
      'Technologie GaN (Nitrure de Gallium) pour une charge plus efficace et moins de chaleur',
      'Puissance maximale de 65W via le port USB-C principal',
      "Charge intelligente qui s'adapte aux besoins de votre appareil",
      'Protections multiples contre les surtensions, surchauffes et courts-circuits',
      'Compatible avec MacBook, iPhone, Samsung, iPad et autres appareils USB-C'
    ],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6-PzCy-47LExPVhmTpGvqDvHJUT1yoa4NhJQjSOSss0A1pImJFnSU1Zlrd0GHIwA7qSOJixW8WIxQYzleF2l7dpIqCeXdfuteZeViu9RchJuRyveHuLj0EV6l3fayAaCZlybMeJ_nh8lwjKCiqJEBOVW9HHMYW_IYhs5lvPzHgLnzvJHstCornVqsEx7QlLMQrb4xja4WxozWpAGanngGnZjMLdjpccnZPYEEEMXnOe61dtmyCIJi6YvAFPDf7tCJ8ojRBsoiT1Sb',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDM9pXG2JOOngvqdudDIysGjRL0czJwD08aNiX4L9KwOLs1I4vGcJHzzGLP2KDLjas49w7hE0UudVZEexExOsB9oY9a0U6JEAdkd_PwAxwKvsYF8PiWH8JaBL-N3VgAKjV8AEhljeUMUww8vZPXlk0Alu4nWVhk8HAGPq4AAaHN8Af6TT_MKjIXR-kutYg-WXjksoGXcxRe1sAKDYscK0D44HE2o1hA3WYp2F6o73h46sa4q_Lwrf8U8JG3-B6GqQbwZi1evPSoeX0D'
    ],
    stock: true
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.header.home}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <Link href="/categories" className="hover:text-primary transition-colors">{t.header.categories}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <span className="text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-slate-200 dark:border-slate-700">
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                    -{product.discount}%
                  </div>
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${product.images[0]}')` }}></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button key={idx} className={`relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors p-2`}>
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${img}')` }}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-6">
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{product.name}</h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-bold">{product.rating}</span>
                    <span className="text-slate-400">({product.reviews} {t.product.reviews})</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      {t.product.inStock}
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{product.price} <span className="text-2xl">DH</span></span>
                  <span className="text-xl text-slate-400 line-through font-medium mb-1.5">{product.originalPrice} DH</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t.product.description}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.product.features}</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-primary mt-0.5 text-xl">check</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 w-fit">
                    <button className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-slate-900 dark:text-white">1</span>
                    <button className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <button className="flex-grow bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)] flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {t.product.addToCart}
                  </button>
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">local_shipping</span>
                    {t.product.freeShipping}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">verified_user</span>
                    {t.product.warranty}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
