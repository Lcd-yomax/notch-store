'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const slides = [
  {
    id: 1,
    bgColor: "bg-[#e6f4f6]", // Light blue/teal background
    badge: "home.limitedOffer",
    title1: "home.heroTitle1",
    title2: "home.heroTitle2",
    desc: "home.heroDesc",
    buttonText: "home.buyNow",
    buttonLink: "/product/1",
    imageLeft: "https://images.unsplash.com/photo-1555529771-835f59bfc50c?q=80&w=800&auto=format&fit=crop",
    imageRight: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop",
    textColor: "text-slate-600",
    titleColor: "text-slate-800",
    highlightColor: "text-[#4a6572]"
  },
  {
    id: 2,
    bgColor: "bg-[#fdf4e3]", // Light yellow/orange background
    badge: "home.newCollection",
    title1: "home.heroTitle3",
    title2: "home.heroTitle4",
    desc: "home.heroDesc2",
    buttonText: "home.discover",
    buttonLink: "/categories",
    imageLeft: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop",
    imageRight: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    textColor: "text-slate-600",
    titleColor: "text-slate-800",
    highlightColor: "text-[#d97757]"
  },
  {
    id: 3,
    bgColor: "bg-[#f0fdf4]", // Light green background
    badge: "home.specialPromo",
    title1: "home.heroTitle5",
    title2: "home.heroTitle6",
    desc: "home.heroDesc3",
    buttonText: "home.shopNow",
    buttonLink: "/categories",
    imageLeft: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    imageRight: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    textColor: "text-slate-600",
    titleColor: "text-slate-800",
    highlightColor: "text-emerald-700"
  }
];

export default function HeroSlider() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const getTranslation = (keyPath: string) => {
    const keys = keyPath.split('.');
    let current: any = t;
    for (const key of keys) {
      if (current[key] === undefined) return keyPath;
      current = current[key];
    }
    return current;
  };

  return (
    <section className="relative w-full min-h-[650px] lg:min-h-[550px] overflow-hidden bg-white">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } ${slide.bgColor}`}
        >
          {/* Decorative Elements (matching the reference image) */}
          <div className="absolute top-[-5%] left-[-2%] w-64 h-64 rounded-full border-[3px] border-[#4a6572]/20 opacity-60"></div>
          <div className="absolute top-[10%] left-[15%] w-8 h-8 rounded-full bg-[#4a6572]/40"></div>
          <div className="absolute top-[20%] left-[5%] w-32 h-32 rounded-full bg-teal-500/20"></div>

          <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full border-[3px] border-[#4a6572]/20 opacity-60"></div>
          <div className="absolute bottom-[15%] right-[10%] w-40 h-40 rounded-full bg-[#4a6572]/80"></div>
          <div className="absolute top-[30%] right-[5%] w-12 h-12 rounded-full bg-teal-500/40"></div>

          {/* Wavy Line SVG */}
          <svg className="absolute top-[15%] left-0 w-full h-24 opacity-30 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 50C240 10 480 90 720 50C960 10 1200 90 1440 50" stroke="#0d9488" strokeWidth="4" strokeLinecap="round"/>
          </svg>

          <div className="relative z-20 w-full h-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between px-4 lg:px-12">
            
            {/* Left Image (Desktop Only) */}
            <div className={`hidden lg:block w-1/3 h-full relative transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="absolute bottom-0 left-0 w-full h-[85%] bg-contain bg-bottom bg-no-repeat mix-blend-multiply" style={{ backgroundImage: `url('${slide.imageLeft}')` }}></div>
            </div>

            {/* Center Content */}
            <div className={`w-full lg:w-1/3 flex flex-col items-center text-center z-30 pt-16 lg:pt-0 transition-all duration-1000 delay-100 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className={`text-sm lg:text-base font-bold mb-4 ${slide.textColor} tracking-wide`}>
                {getTranslation(slide.badge)}
              </p>
              <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-serif font-black leading-[1.1] mb-6 ${slide.titleColor}`}>
                {getTranslation(slide.title1)} <br/>
                <span className={slide.highlightColor}>{getTranslation(slide.title2)}</span>
              </h1>
              <p className={`text-base lg:text-lg font-medium mb-8 max-w-md ${slide.textColor}`}>
                {getTranslation(slide.desc)}
              </p>
              <Link href={slide.buttonLink} className="bg-[#d97757] hover:bg-[#c26243] text-white px-6 py-4 font-bold text-sm md:text-base transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide w-full sm:w-auto rounded-sm">
                {getTranslation(slide.buttonText)}
                <span className={`material-symbols-outlined ${language === 'ar' ? 'rotate-180' : ''}`}>arrow_forward</span>
              </Link>
            </div>

            {/* Right Image (Mobile & Desktop) */}
            <div className={`w-full lg:w-1/3 h-[350px] lg:h-full relative mt-auto lg:mt-0 transition-all duration-1000 delay-500 ${index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              <div className="absolute bottom-0 right-0 lg:left-0 w-full h-[110%] lg:h-[85%] bg-contain bg-bottom bg-no-repeat mix-blend-multiply" style={{ backgroundImage: `url('${slide.imageRight}')` }}></div>
            </div>

          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-[#4a6572] w-10' : 'bg-[#4a6572]/30 hover:bg-[#4a6572]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
