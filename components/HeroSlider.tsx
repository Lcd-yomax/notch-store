'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

import { heroSlides as slides } from '@/lib/dummyData';

export default function HeroSlider() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  // Starts false so the first slide text begins in its "hidden" state and
  // transitions in — the same entrance animation used for every slide change.
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Double rAF: first frame commits the hidden state to the DOM,
    // second frame flips textVisible so the CSS transition fires.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setTextVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (paused) return;
    const delay = slides[currentSlide].id === 0 || slides[currentSlide].image.endsWith('.mp4') ? 15000 : 10000;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, delay);
    return () => clearTimeout(timer);
  }, [currentSlide, paused]);

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
    <section onFocusCapture={() => setPaused(true)} className="relative w-full min-h-[600px] lg:min-h-[620px] overflow-hidden bg-slate-900 mt-0">
      <h1 className="sr-only">Notch — {t.phoneDiscovery.eyebrow}</h1>
      {slides.map((slide, index) => {
        const isPhoneSlide = slide.id === 0;
        // Text is shown when this slide is active AND the entrance delay has passed
        const textShown = index === currentSlide && textVisible;

        return (
          <Link
            href={slide.buttonLink}
            aria-hidden={index !== currentSlide}
            tabIndex={index === currentSlide ? 0 : -1}
            key={slide.id}
            className={`absolute inset-0 w-full h-full block transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Media */}
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
                <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
              </div>
            ) : isPhoneSlide ? (
              <div className="absolute inset-0 bg-[#080909]">
                <div className="absolute bottom-0 end-0 h-[370px] w-full sm:h-[420px] sm:w-[85%] lg:h-full lg:w-auto lg:aspect-[3/2]">
                  <Image src={slide.image} alt="" fill priority sizes="(min-width: 1024px) 930px, 100vw" quality={85} className="object-cover object-[78%_center] sm:object-right lg:object-contain lg:[mask-image:linear-gradient(to_right,transparent,black_20%)] rtl:-scale-x-100" />
                </div>
                <div className="absolute inset-x-0 top-0 h-[330px] bg-gradient-to-b from-[#080909] from-70% to-transparent lg:hidden" />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full transition-transform duration-1000 hover:scale-105">
                <Image
                  src={slide.image}
                  alt="Banner Image"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  quality={80}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r rtl:bg-gradient-to-l from-black/90 via-black/50 to-transparent" />
              </div>
            )}

            <div className={`relative z-20 w-full h-full max-w-[1440px] mx-auto flex justify-start px-6 lg:px-12 ${isPhoneSlide ? 'items-start pt-10 lg:pt-0 lg:items-center' : 'items-center'}`}>
              <div
                className={`w-full ${isPhoneSlide ? 'lg:w-1/2' : 'lg:w-3/5'} flex flex-col items-start text-start z-30 transition-all duration-[1200ms] ease-out ${
                  textShown
                    ? 'translate-x-0 opacity-100'
                    : 'ltr:-translate-x-16 rtl:translate-x-16 opacity-0'
                }`}
              >
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 transition-all duration-[1000ms] ease-out delay-300 ${
                    textShown
                      ? 'translate-y-0 opacity-100 scale-100'
                      : 'translate-y-8 opacity-0 scale-95'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <p className="text-[10px] rtl:text-xs lg:text-xs rtl:lg:text-sm font-bold text-amber-400 tracking-widest uppercase shadow-black/50 drop-shadow-md">
                    {getTranslation(slide.badge)}
                  </p>
                </div>

                <h2
                  className={`text-4xl rtl:text-5xl lg:text-5xl rtl:lg:text-6xl xl:text-6xl rtl:xl:text-7xl font-serif font-black leading-[1.1] rtl:leading-[1.4] mb-4 text-white drop-shadow-xl transition-all duration-[1200ms] delay-[500ms] ease-out ${
                    textShown ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                >
                  {getTranslation(slide.title1)} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r rtl:bg-gradient-to-l from-amber-300 to-amber-500">
                    {getTranslation(slide.title2)}
                  </span>
                </h2>

                <p
                  className={`text-base rtl:text-lg lg:text-lg rtl:lg:text-xl font-medium max-w-lg text-slate-200 drop-shadow-lg transition-all duration-[1200ms] delay-[700ms] ease-out ${
                    textShown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  {getTranslation(slide.desc)}
                </p>
                <span className="inline-flex items-center gap-3 mt-5 rounded-xl bg-primary text-slate-900 font-bold px-5 py-3">
                  {isPhoneSlide || slide.id === 1 ? getTranslation(slide.buttonText) : t.phoneDiscovery.accessories}
                  <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Slider controls */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="h-10 px-2 flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-white rounded-full"
            aria-label={`${t.phoneDiscovery.slide} ${index + 1}`}
            aria-pressed={index === currentSlide}
          ><span aria-hidden="true" className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 w-2'}`} /></button>
        ))}
        <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? t.phoneDiscovery.play : t.phoneDiscovery.pause} className="text-white/80 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:text-white focus-visible:outline-2 focus-visible:outline-white">
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
