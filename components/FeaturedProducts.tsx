'use client';

import Link from 'next/link';
import Image from 'next/image';

const featuredProducts = [
  {
    id: 'f1',
    name: 'Nike Comfy Vapor Maxpro',
    price: '$220.00 - $250.00',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'f2',
    name: 'Addidas FuelCell Propel...',
    price: '$45.00 - $50.00',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'f3',
    name: 'Tuma Grey',
    price: '$400.00 - $1,000.00',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'f4',
    name: 'Pissot Super Dry',
    price: '$250.00',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'f5',
    name: 'Zara Army Bag',
    price: '$260.00',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop'
  }
];

export default function FeaturedProducts() {
  const largeProduct = featuredProducts[0];
  const smallProducts = featuredProducts.slice(1);

  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8">Featured Products</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Large Product */}
        <Link href={`/product/${largeProduct.id}`} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[400px] lg:min-h-[500px]">
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src={largeProduct.image} 
              alt={largeProduct.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="font-bold text-white text-lg md:text-xl drop-shadow-md">{largeProduct.name}</h3>
            <span className="font-medium text-white text-lg drop-shadow-md">{largeProduct.price}</span>
          </div>
        </Link>

        {/* Small Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {smallProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className="group bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col justify-between relative overflow-hidden aspect-square sm:aspect-auto sm:min-h-[240px]">
              <div className="absolute inset-0 w-full h-full">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-1 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <h3 className="font-bold text-white text-sm truncate max-w-full xl:max-w-[60%] drop-shadow-md">{product.name}</h3>
                <span className="font-medium text-white text-sm drop-shadow-md">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
