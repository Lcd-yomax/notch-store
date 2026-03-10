'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const router = useRouter();
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string | null>(null);

  // Order form state
  const [orderName, setOrderName] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderCity, setOrderCity] = useState('');
  const [orderPhone, setOrderPhone] = useState('');

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/success');
  };

  const [reviewsList, setReviewsList] = useState<{ id: number; name: string; rating: number; date: string; comment: string; image: string | null; }[]>([
    {
      id: 1,
      name: t.productDetails.reviews[0].name,
      rating: 5,
      date: t.productDetails.reviews[0].date,
      comment: t.productDetails.reviews[0].comment,
      image: null
    },
    {
      id: 2,
      name: t.productDetails.reviews[1].name,
      rating: 4,
      date: t.productDetails.reviews[1].date,
      comment: t.productDetails.reviews[1].comment,
      image: null
    }
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      name,
      rating,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      comment,
      image
    };
    setReviewsList([newReview, ...reviewsList]);
    setName('');
    setEmail('');
    setComment('');
    setRating(5);
    setImage(null);
  };

  // Mock product data based on ID
  const product = {
    id: id,
    name: t.productDetails.name,
    price: 249,
    originalPrice: 349,
    discount: 30,
    rating: 4.8,
    reviews: 124,
    description: t.productDetails.description,
    features: t.productDetails.features,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCykLfWFjyRIPtV9bQD2tx9t5dH4VHdPpXqeg_FwOd8V4rRcA45Nc-1u-1PtUPAyTFZmbVygQ_bRpOxOwUQL7SMNW6yhOculCR-wC9bdGx0vZTLcrL9GfE9mPVVI5pZQCMpfX-hs0T_QJbRkUa7Hpa36EWd9XJnr36wt4CMMNBRJxM8OCH6IQnq6D4GnvsMQH8zGJ6ZnOh_RcBYQYWt75N0i0LNEoEBnTxEfwd0r3caDh4UPJ57UOQCHx0oaJPbd-xqOKcAsVYHbJmD',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD6-PzCy-47LExPVhmTpGvqDvHJUT1yoa4NhJQjSOSss0A1pImJFnSU1Zlrd0GHIwA7qSOJixW8WIxQYzleF2l7dpIqCeXdfuteZeViu9RchJuRyveHuLj0EV6l3fayAaCZlybMeJ_nh8lwjKCiqJEBOVW9HHMYW_IYhs5lvPzHgLnzvJHstCornVqsEx7QlLMQrb4xja4WxozWpAGanngGnZjMLdjpccnZPYEEEMXnOe61dtmyCIJi6YvAFPDf7tCJ8ojRBsoiT1Sb',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDM9pXG2JOOngvqdudDIysGjRL0czJwD08aNiX4L9KwOLs1I4vGcJHzzGLP2KDLjas49w7hE0UudVZEexExOsB9oY9a0U6JEAdkd_PwAxwKvsYF8PiWH8JaBL-N3VgAKjV8AEhljeUMUww8vZPXlk0Alu4nWVhk8HAGPq4AAaHN8Af6TT_MKjIXR-kutYg-WXjksoGXcxRe1sAKDYscK0D44HE2o1hA3WYp2F6o73h46sa4q_Lwrf8U8JG3-B6GqQbwZi1evPSoeX0D'
    ],
    stock: true
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-slate-950 py-10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">{t.header.home}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <Link href="/categories" className="hover:text-primary transition-colors">{t.header.categories}</Link>
            <span className="material-symbols-outlined text-sm rtl:rotate-180">chevron_right</span>
            <span className="text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="flex flex-col gap-4">
                <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-slate-200 dark:border-slate-700">
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                    -{product.discount}%
                  </div>
                  <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${product.images[0]}')` }}></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button key={idx} className={`relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-colors p-2`}>
                      <div className="w-full h-full bg-contain bg-center bg-no-repeat mix-blend-multiply dark:mix-blend-normal" style={{ backgroundImage: `url('${img}')` }}></div>
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
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      {t.product.inStock}
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">{product.price} <span className="text-2xl">DH</span></span>
                  <span className="text-xl text-slate-400 line-through font-medium mb-1.5">{product.originalPrice} DH</span>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{t.product.description}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mb-10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t.product.features}</h3>
                  <ul className="space-y-3">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-primary mt-0.5 text-xl">check</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <form onSubmit={handleOrderSubmit} className="mt-auto flex flex-col gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
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
                  <button type="submit" className="w-full bg-primary hover:bg-amber-500 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_8px_30px_rgb(254,165,29,0.3)] hover:shadow-[0_8px_30px_rgb(254,165,29,0.5)] flex items-center justify-center gap-3 mt-2">
                    <span className="material-symbols-outlined">local_shipping</span>
                    {t.product.orderNow || 'Commander'}
                  </button>
                </form>
                
                <div className="mt-6 flex items-center justify-center gap-6 text-sm font-medium text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">local_shipping</span>
                    {t.product.freeShipping}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">verified_user</span>
                    {t.product.warranty}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 lg:p-10 shadow-sm">
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
                          {[1,2,3,4,5].map(star => (
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
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.reviewsSection.leaveReview}</h3>
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                  {/* Rating */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{t.reviewsSection.rating}</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
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

                  <button type="submit" className="mt-2 w-full bg-primary hover:bg-amber-500 text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgb(254,165,29,0.3)] hover:shadow-[0_6px_20px_rgb(254,165,29,0.5)]">
                    {t.reviewsSection.submit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
