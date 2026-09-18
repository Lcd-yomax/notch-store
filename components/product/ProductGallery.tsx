'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageSizes } from '@/lib/imageUtils';

/** Remount with a new `key` when the image set changes (e.g. another variation is selected). */
export default function ProductGallery({ images, alt, discount }: { images: string[]; alt: string; discount?: number | null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden flex items-center justify-center">
        {discount != null && discount > 0 && (
          <div className="absolute top-4 start-4 z-10 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}
        {active ? (
          <Image
            src={ImageSizes.full(active)}
            alt={alt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-contain mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`${alt} ${idx + 1}`}
              aria-current={idx === activeIndex}
              className={`relative aspect-square bg-slate-100 rounded-xl overflow-hidden border-2 ${idx === activeIndex ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors cursor-pointer`}
            >
              <Image src={ImageSizes.thumbnail(img)} alt="" fill sizes="120px" className="object-contain mix-blend-multiply p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
