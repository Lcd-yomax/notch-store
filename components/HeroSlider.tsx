'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop", // Shopping / e-commerce theme
    badge: "home.limitedOffer",
    title1: "home.heroTitle1",
    title2: "home.heroTitle2",
    desc: "home.heroDesc",
    buttonText: "home.buyNow",
    buttonLink: "/shop",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", // Premium audio headphones
    badge: "home.newCollection",
    title1: "home.heroTitle3",
    title2: "home.heroTitle4",
    desc: "home.heroDesc2",
    buttonText: "home.discover",
    buttonLink: "/categories",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop", // Premium smartwatch
    badge: "home.specialPromo",
    title1: "home.heroTitle5",
    title2: "home.heroTitle6",
    desc: "home.heroDesc3",
    buttonText: "home.shopNow",
    buttonLink: "/categories",
  }
];

export default function HeroSlider() {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const getTranslation = (keyPath: string) => {
    const keys = keyPath.split('.');
    let current: any = t;
    for (const key of keys) {
      if (current[key] === undefined) return keyPath;
      current = current[key];
    }
    return current;
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Gradient direction based on RTL/LTR
  const gradientDir = language === 'ar' ? 'bg-gradient-to-l' : 'bg-gradient-to-r';

  return (
    <section 
      className="relative w-full h-[600px] lg:h-[750px] bg-slate-900 group overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with slow zoom effect */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
            style={{ 
              backgroundImage: `url('${slide.image}')`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          {/* Overlays for text readability */}
          <div className={`absolute inset-0 ${gradientDir} from-black/90 via-black/50 to-transparent`} />
          <div className="absolute inset-0 bg-black/30" />

          {/* Content */}
          <div className="relative z-20 w-full h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col justify-center">
            <div className={`max-w-2xl transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-bold text-sm mb-6 backdrop-blur-md">
                {getTranslation(slide.badge)}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg tracking-tight">
                {getTranslation(slide.title1)} <br className="hidden sm:block" />
                <span className="text-primary">{getTranslation(slide.title2)}</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-200 font-medium mb-10 max-w-lg drop-shadow-md leading-relaxed">
                {getTranslation(slide.desc)}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href={slide.buttonLink} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-3 group/btn">
                  {getTranslation(slide.buttonText)}
                  <span className={`material-symbols-outlined text-xl transition-transform group-hover/btn:translate-x-1 ${language === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`}>arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={language === 'ar' ? nextSlide : prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 cursor-pointer"
        aria-label="Previous slide"
      >
        <span className="material-symbols-outlined text-2xl">chevron_left</span>
      </button>

      <button 
        onClick={language === 'ar' ? prevSlide : nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 cursor-pointer"
        aria-label="Next slide"
      >
        <span className="material-symbols-outlined text-2xl">chevron_right</span>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-primary w-10' : 'bg-white/50 hover:bg-white/80 w-2.5'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
