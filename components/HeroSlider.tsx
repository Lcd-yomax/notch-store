'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { heroSlides as slides } from '@/lib/dummyData';

export default function HeroSlider() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // If it's an mp4 video, give it 15 seconds so it has time to play and loop a couple of times.
    // Otherwise, wait 10 seconds for standard images/gifs.
    const delay = slides[currentSlide].image.endsWith('.mp4') ? 15000 : 10000;
    
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentSlide]);

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
    <section className="relative w-full min-h-[650px] lg:min-h-[700px] overflow-hidden bg-slate-900 mt-0">
      <h1 className="sr-only">Notch-Tech | Premium Tech E-commerce</h1>
      {slides.map((slide, index) => (
        <Link
          href="/categories"
          key={slide.id}
          className={`absolute inset-0 w-full h-full block transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Media Content */}
          {slide.image.endsWith('.mp4') ? (
            <div className="absolute inset-0 w-full h-full">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                // @ts-ignore — fetchPriority is valid HTML but not yet in React types
                fetchPriority="high"
                poster="/images/1.webp"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              >
                <source src={slide.image} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-black/90 via-black/50 to-transparent transition-colors duration-300"></div>
            </div>
          ) : (
            <div className={`absolute inset-0 w-full h-full transition-transform duration-1000 hover:scale-105`}>
              <Image 
                src={slide.image}
                alt="Banner Image"
                fill
                priority={index === 0}
                sizes="100vw"
                quality={80}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-black/90 via-black/50 to-transparent transition-colors duration-300"></div>
            </div>
          )}

          <div className="relative z-20 w-full h-full max-w-[1440px] mx-auto flex justify-start items-center px-4 lg:px-12">
            {/* Center Content */}
            <div className={`w-full lg:w-3/5 flex flex-col items-start text-left rtl:text-right z-30 ltr:-ml-2 sm:ltr:-ml-4 lg:ltr:-ml-32 xl:ltr:-ml-40 rtl:-mr-2 sm:rtl:-mr-4 lg:rtl:-mr-12 transition-all duration-[1200ms] ease-out ${index === currentSlide ? 'translate-x-0 opacity-100' : 'ltr:-translate-x-16 rtl:translate-x-16 opacity-0'}`}>
              
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 transition-all duration-[1000ms] ease-out delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <p className="text-[10px] rtl:text-xs lg:text-xs rtl:lg:text-sm font-bold text-amber-400 tracking-widest uppercase shadow-black/50 drop-shadow-md">
                  {getTranslation(slide.badge)}
                </p>
              </div>

              <h2 className={`text-4xl rtl:text-5xl lg:text-5xl rtl:lg:text-6xl xl:text-6xl rtl:xl:text-7xl font-serif font-black leading-[1.1] rtl:leading-[1.4] mb-4 text-white drop-shadow-xl transition-all duration-[1200ms] delay-[500ms] ease-out ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                {getTranslation(slide.title1)} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r rtl:bg-gradient-to-l from-amber-300 to-amber-500">{getTranslation(slide.title2)}</span>
              </h2>
              
              <p className={`text-base rtl:text-lg lg:text-lg rtl:lg:text-xl font-medium max-w-lg text-slate-200 drop-shadow-lg transition-all duration-[1200ms] delay-[700ms] ease-out ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {getTranslation(slide.desc)}
              </p>
            </div>
          </div>
        </Link>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary w-10' : 'bg-white/50 hover:bg-white'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
