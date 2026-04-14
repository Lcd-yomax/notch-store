"use client"
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { useState, useEffect } from 'react'

export default function ProductCompareSlider() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="w-full py-20 bg-white border-t border-slate-100">
      <div className="text-center mb-12">
        <p className="text-sm uppercase font-extrabold tracking-widest text-primary mb-3">
          Nos Coloris
        </p>
        <h2 className="text-slate-900 text-3xl md:text-4xl font-black tracking-tight">
          Explorez Nos Variantes
        </h2>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        {!mounted ? (
          <div className="rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 ring-1 ring-black/5 w-full aspect-square md:aspect-[4/3] bg-slate-100 animate-pulse" />
        ) : (
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 ring-1 ring-black/5 w-full aspect-square md:aspect-[4/3]">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src="/images/11.webp"
                  alt="Coloris Noir"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src="/images/22.webp"
                  alt="Coloris Blanc"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              }
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
