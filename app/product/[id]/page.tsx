'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { use, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageSizes } from '@/lib/imageUtils';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();

  // State
  const [product, setProduct] = useState<any>(null);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Variation States
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  // Data Fetching
  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch(`/api/products?id=${id}`),
          fetch(`/api/reviews?product_id=${id}&limit=10`)
        ]);

        const prodData = await prodRes.json();
        const revData = await revRes.json();

        if (prodData && prodData.length > 0) {
          const p = prodData[0];
          const mappedProduct = {
            id: p.id,
            name: p.name,
            description: p.description || '',
            features: [
              'Haute qualité',
              'Design moderne'
            ], // Fallback default features
            images: p.images?.length > 0 ? p.images.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.url) : [p.thumbnail_url || ''],
            stock: p.is_active,
            discount: p.variations?.[0]?.discount_label ? parseInt(p.variations[0].discount_label) || 0 : 0,
            rating: 5.0, // Calculate dynamically later or fetch from aggregate
            reviews: revData?.length || 0,
            price: p.variations?.[0]?.price || 0,
            originalPrice: p.variations?.[0]?.price_display || null,
            variations: (p.variations || []).map((v: any, index: number) => ({
              id: v.id,
              color: v.color || null,
              size: v.size || null,
              price: v.price,
              originalPrice: v.price_display || null,
              stock: v.stock,
              imageIndex: 0 // Simplification: all use main image unless categorized
            }))
          };
          setProduct(mappedProduct);
        }

        if (Array.isArray(revData)) {
          setReviewsList(revData.map(r => ({
            id: r.id,
            name: r.full_name,
            rating: r.stars,
            date: new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            comment: r.comment,
            image: r.image_url || null
          })));
        }
      } catch (error) {
        console.error('Failed to load product details', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Sticky button state and refs
  const formRef = useRef<HTMLFormElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky button if the trigger element is above the viewport (user scrolled past the form)
        // boundingClientRect.top < 0 means the element's top edge is above the top of the window.
        setShowStickyButton(entry.boundingClientRect.top < 0 && !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [product]);

  const scrollToForm = () => {
    if (formRef.current) {
      // Scroll slightly above the form to ensure it's not hidden under any fixed headers
      const y = formRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Focus the first input (Nom complet) after a small delay to let scrolling finish
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector('input');
        if (firstInput) (firstInput as HTMLElement).focus();
      }, 600);
    }
  };

  // Order form state
  const [orderName, setOrderName] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingOrder(true);

    try {
      const price = currentVariation?.price ?? product.price;
      const variationId = currentVariation?.id ?? product.variations?.[0]?.id ?? null;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: orderName,
          phone: orderPhone,
          address: orderAddress,
          city: orderCity,
          total_amount: price,
          notes: `Couleur: ${selectedColor || 'N/A'} | Taille: ${selectedSize || 'N/A'}`,
          items: variationId
            ? [{ variation_id: variationId, quantity: 1, unit_price: price }]
            : []
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Order failed');
      }

      router.push('/success');
    } catch (error: any) {
      console.error('Order submission error:', error);
      alert("Une erreur est survenue lors de la commande. Veuillez réessayer.");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: id,
          author_name: name,
          author_email: email,
          rating,
          content: comment,
          images: image ? [image] : []
        })
      });

      if (!res.ok) throw new Error('Failed to submit review');

      setName('');
      setEmail('');
      setComment('');
      setRating(5);
      setImage(null);
      setIsReviewSubmitted(true);
      setImage(null);
      setIsReviewSubmitted(true);
      // We do not add it to reviewsList here because it needs admin approval first.

    } catch (error) {
      console.error('Error submitting review:', error);
      alert("Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };



  // Select first available options on load
  useEffect(() => {
    if (product?.variations?.length > 0 && !selectedColor) {
      const colors = Array.from(new Set(product.variations.map((v: any) => v.color).filter(Boolean)));
      if (colors.length > 0) setSelectedColor(colors[0] as string);
    }
  }, [product, selectedColor]);

  useEffect(() => {
    if (product?.variations?.length > 0 && selectedColor && !selectedSize) {
      const availableSizesForColor = product.variations
        .filter((v: any) => v.color === selectedColor && v.size)
        .map((v: any) => v.size);
      if (availableSizesForColor.length > 0) setSelectedSize(availableSizesForColor[0] as string);
    }
  }, [product, selectedColor, selectedSize]);

  // Derived state for the currently matching variation
  const currentVariation = product?.variations?.find(
    (v: any) => (v.color === selectedColor || (!v.color && !selectedColor)) &&
      (v.size === selectedSize || (!v.size && !selectedSize))
  );

  // Auto-switch image when color changes
  useEffect(() => {
    if (currentVariation?.imageIndex !== undefined) {
      setActiveImageIndex(currentVariation.imageIndex);
    }
  }, [currentVariation]);

  const availableColors = Array.from(new Set(product?.variations?.map((v: any) => v.color).filter(Boolean) || [])) as string[];
  const availableSizes = Array.from(new Set(product?.variations?.map((v: any) => v.size).filter(Boolean) || [])) as string[];

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-white dark:bg-slate-950 py-10 flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-grow bg-white dark:bg-slate-950 py-10 flex flex-col items-center justify-center text-center min-h-[60vh]">
          <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4">search_off</span>
          <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Produit introuvable</h1>
          <Link href="/shop" className="text-primary hover:underline">Retour à la boutique</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-grow bg-white dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.header.home}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <Link href="/categories" className="hover:text-primary transition-colors">{t.header.categories}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <span className="text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square  dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                    -{product.discount}%
                  </div>
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${ImageSizes.full(product.images[activeImageIndex])}')` }}></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 ${idx === activeImageIndex ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors p-2`}
                    >
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${ImageSizes.thumbnail(img)}')` }}></div>
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

                    {currentVariation ? (
                      currentVariation.stock > 0 ? (
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {t.product.inStock}
                        </span>
                      ) : (
                        <span className="text-red-500 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {t.product.outOfStock}
                        </span>
                      )
                    ) : product.stock ? (
                      <span className="text-emerald-500 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {t.product.inStock}
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">error</span>
                        {t.product.outOfStock}
                      </span>
                    )}
                  </div>
                </div>

                {/* Variations */}
                {availableColors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">{t.product.color}: <span className="text-slate-500 font-normal normal-case">{selectedColor}</span></h3>
                    <div className="flex items-center gap-3">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${selectedColor === color
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableSizes.length > 0 && selectedColor && (
                  <div className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">{t.product.size}: <span className="text-slate-500 font-normal normal-case">{selectedSize}</span></h3>
                    <div className="flex items-center gap-3">
                      {product.variations.filter((v: any) => v.color === selectedColor && v.size).map((v: any) => (
                        <button
                          key={v.size}
                          onClick={() => setSelectedSize(v.size as string)}
                          disabled={v.stock === 0}
                          className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${selectedSize === v.size
                            ? 'border-primary text-primary bg-primary/5 shadow-sm'
                            : v.stock === 0
                              ? 'border-dashed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed  dark:bg-slate-900/50'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover: dark:hover:bg-slate-800/50'
                            }`}
                        >
                          {v.size} {v.stock === 0 && <span className="block text-[10px] font-normal leading-none mt-1 text-red-400">{t.product.soldOut}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-4 mb-8">
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{currentVariation?.price ?? product.price} <span className="text-2xl">DH</span></span>
                  {(currentVariation?.originalPrice ?? product.originalPrice) && (
                    <span className="text-xl text-slate-400 line-through font-medium mb-1.5">{currentVariation?.originalPrice ?? product.originalPrice} DH</span>
                  )}
                </div>

                {t.product.orderForm?.title && (
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.product.orderForm.title}</h2>
                )}

                <form ref={formRef} onSubmit={handleOrderSubmit} className="mb-4 flex flex-col gap-4  dark:bg-slate-800/50 p-6 rounded-2xl">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.product.orderForm?.fullName || 'Nom complet'}</label>
                      <input
                        type="text"
                        required
                        value={orderName}
                        onChange={(e) => setOrderName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.product.orderForm?.phone || 'Téléphone'}</label>
                      <input
                        type="tel"
                        required
                        pattern="^0[678][0-9]{8}$"
                        title="Le numéro doit commencer par 06, 07 ou 08 et contenir 10 chiffres (ex: 0612345678)"
                        value={orderPhone}
                        onChange={(e) => setOrderPhone(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.product.orderForm?.address || 'Adresse'}</label>
                    <input
                      type="text"
                      required
                      value={orderAddress}
                      onChange={(e) => setOrderAddress(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">{t.product.orderForm?.city || 'Ville'}</label>
                    <input
                      type="text"
                      required
                      value={orderCity}
                      onChange={(e) => setOrderCity(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="btn-glow-shake flex-1 w-full bg-primary hover:bg-amber-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-xl py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      {isSubmittingOrder ? (
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined">local_shipping</span>
                      )}
                      {isSubmittingOrder ? 'Envoi en cours...' : (t.product.orderNow || 'Acheter maintenant')}
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.images[0]
                        });
                      }}
                      className="flex-1 w-full bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group/btn cursor-pointer"
                    >
                      <span className="material-symbols-outlined group-hover/btn:scale-110 transition-transform">shopping_cart</span>
                      {t.product.addToCart || 'Ajouter au panier'}
                    </button> */}
                  </div>
                </form>
                <div className="flex items-center justify-center w-full gap-2 text-xl font-bold text-slate-700 dark:text-slate-300 py-2 mb-8 mt-0">
                  <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
                  {t.product.freeShipping}
                </div>
                {/* Scroll Trigger for Sticky Button */}
                <div ref={triggerRef} className="h-1 w-full" aria-hidden="true" />

                <div className="mb-8 overflow-hidden">
                  <button
                    onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                    className="w-full flex items-center justify-between py-4 group"
                  >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">description</span>
                      {t.product.description}
                    </h3>
                    <span className={`material-symbols-outlined text-slate-400 group-hover:text-primary transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isDescriptionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="pt-2 pb-6">
                        <div
                          className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-slate-800 dark:prose-strong:text-white prose-li:text-slate-600 dark:prose-li:text-slate-400 prose-hr:border-slate-200 dark:prose-hr:border-slate-700"
                          dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.product.features}</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-primary mt-0.5 text-xl">check</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6 flex items-center justify-center gap-6 text-sm font-medium text-slate-500">

                  {/* <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">verified_user</span>
                    {t.product.warranty}
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{t.reviewsSection.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Reviews List */}
              <div>
                {reviewsList.length === 0 ? (
                  <p className="text-slate-500">{t.reviewsSection.noReviews}</p>
                ) : (
                  <div className="space-y-6">
                    {reviewsList.map(review => (
                      <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-slate-900 dark:text-white">{review.name}</span>
                          <span className="text-sm text-slate-500">{review.date}</span>
                        </div>
                        <div className="flex text-amber-400 mb-3">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                          ))}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{review.comment}</p>
                        {review.image && (
                          <img src={review.image} alt="Review" className="mt-4 rounded-lg max-w-[200px] max-h-[200px] object-cover border border-slate-200 dark:border-slate-700" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Leave a Review Form */}
              <div className=" dark:bg-slate-800/50 p-6 rounded-2xl relative overflow-hidden">
                {isReviewSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                      <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{t.reviewsSection.successTitle || "Merci !"}</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-[300px] mb-8">{t.reviewsSection.successMessage || "Votre avis a été soumis avec succès et est en attente d'approbation par notre équipe."}</p>
                    <button
                      onClick={() => setIsReviewSubmitted(false)}
                      className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
                    >
                      Ajouter un autre avis
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.reviewsSection.leaveReview}</h3>
                    <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                      {/* Rating */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reviewsSection.rating}</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="text-amber-400 focus:outline-none"
                            >
                              <span className="material-symbols-outlined text-2xl transition-all" style={{ fontVariationSettings: star <= (hoverRating || rating) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label htmlFor="reviewName" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reviewsSection.fullName}</label>
                          <input required type="text" id="reviewName" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label htmlFor="reviewEmail" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reviewsSection.email}</label>
                          <input required type="email" id="reviewEmail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="reviewComment" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reviewsSection.comment}</label>
                        <textarea required id="reviewComment" rows={4} value={comment} onChange={e => setComment(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"></textarea>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="reviewImage" className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reviewsSection.image}</label>
                        <input type="file" id="reviewImage" accept="image/*" onChange={handleImageChange} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                      </div>

                      <button type="submit" className="mt-2 w-full bg-primary hover:bg-amber-500 text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgb(254,165,29,0.3)] hover:shadow-[0_6px_20px_rgb(254,165,29,0.5)] cursor-pointer">
                        {t.reviewsSection.submit}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Sticky Bottom Buy Button */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] ${showStickyButton ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4 flex-1">
            <div
              className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url('${product.images[0]}')` }}
            ></div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-900 dark:text-white font-bold truncate max-w-[300px] lg:max-w-[500px]">{product.name}</span>
              <span className="text-sm font-black text-primary">{product.price} DH <span className="text-xs text-slate-500 line-through font-medium ml-1">{product.originalPrice} DH</span></span>
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToForm}
            className="btn-glow-shake flex-1 sm:flex-none w-full sm:w-auto bg-primary hover:bg-amber-500 text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <span className="material-symbols-outlined group-hover:-translate-y-1 transition-transform duration-300">local_shipping</span>
            {t.product.orderNow || 'Acheter maintenant'}
          </button>
        </div>
      </div>
    </>
  );
}
