'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { heroSlides as slides } from '@/lib/dummyData';

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
    <section className="relative w-full min-h-[650px] lg:min-h-[700px] overflow-hidden bg-slate-900">
      {slides.map((slide, index) => (
        <Link
          href="/categories"
          key={slide.id}
          className={`absolute inset-0 w-full h-full block transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70 transition-colors duration-300 hover:bg-black/40"></div>
          </div>

          <div className="relative z-20 w-full h-full max-w-[1440px] mx-auto flex flex-col justify-center px-4 lg:px-12">
            {/* Center Content */}
            <div className={`w-full lg:w-1/2 flex flex-col items-start text-left z-30 pt-16 lg:pt-0 transition-all duration-1000 delay-100 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className={`text-sm lg:text-base font-bold mb-4 text-amber-400 tracking-wide uppercase`}>
                {getTranslation(slide.badge)}
              </p>
              <h1 className={`text-4xl lg:text-5xl xl:text-7xl font-serif font-black leading-[1.1] mb-6 text-white`}>
                {getTranslation(slide.title1)} <br/>
                <span className="text-amber-400">{getTranslation(slide.title2)}</span>
              </h1>
              <p className={`text-base lg:text-xl font-medium mb-8 max-w-lg text-slate-200`}>
                {getTranslation(slide.desc)}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary w-10' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
