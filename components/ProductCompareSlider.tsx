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

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        {!mounted ? (
          <div className="rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 ring-1 ring-black/5 w-full h-[400px] md:h-[600px] xl:h-[750px] bg-slate-100 animate-pulse" />
        ) : (
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 ring-1 ring-black/5 w-full h-[400px] md:h-[600px] xl:h-[750px]">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src="/images/2-1.webp"
                  alt="Coloris Noir"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src="/images/1-1.webp"
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
