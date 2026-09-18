'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { PublicReview } from '@/lib/catalog/types';

export default function ProductReviews({ productId, reviews }: { productId: string; reviews: PublicReview[] }) {
  const { t } = useLanguage();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          author_name: name,
          author_email: email,
          rating,
          content: comment,
          images: image ? [image] : [],
        }),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      setName('');
      setEmail('');
      setComment('');
      setRating(5);
      setImage(null);
      // Not added to the list: reviews need admin approval first.
      setIsReviewSubmitted(true);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(t.common.reviewError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const inputClass =
    'w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all';

  return (
    <div className="mt-16 bg-white rounded-3xl p-6 lg:p-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.reviewsSection.title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          {reviews.length === 0 ? (
            <p className="text-slate-500">{t.reviewsSection.noReviews}</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">{review.full_name}</span>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="currentColor" strokeWidth={0} className={star <= review.stars ? 'text-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                  <p className="text-slate-600">{review.comment}</p>
                  {review.image_url && (
                    // Review photos can be data URLs, which next/image does not handle
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={review.image_url} alt="Review" width={200} height={200} className="mt-4 rounded-lg max-w-[200px] max-h-[200px] object-cover border border-slate-200" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl relative overflow-hidden">
          {isReviewSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{t.reviewsSection.successTitle || 'Merci !'}</h3>
              <p className="text-slate-600 max-w-[300px] mb-8">{t.reviewsSection.successMessage}</p>
              <button
                onClick={() => setIsReviewSubmitted(false)}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                {t.common.addAnotherReview}
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-900 mb-6">{t.reviewsSection.leaveReview}</h3>
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">{t.reviewsSection.rating}</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star}/5`}
                        className="text-amber-400 focus:outline-none cursor-pointer"
                      >
                        <Star size={24} fill="currentColor" strokeWidth={0} className={star <= (hoverRating || rating) ? 'text-amber-400 transition-all' : 'text-slate-200 transition-all'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="reviewName" className="text-sm font-bold text-slate-700">{t.reviewsSection.fullName}</label>
                    <input required type="text" id="reviewName" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="reviewEmail" className="text-sm font-bold text-slate-700">{t.reviewsSection.email}</label>
                    <input required type="email" id="reviewEmail" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="reviewComment" className="text-sm font-bold text-slate-700">{t.reviewsSection.comment}</label>
                  <textarea required id="reviewComment" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className={`${inputClass} resize-none`}></textarea>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="reviewImage" className="text-sm font-bold text-slate-700">{t.reviewsSection.image}</label>
                  <input
                    type="file"
                    id="reviewImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all file:me-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-primary hover:bg-amber-500 disabled:opacity-70 text-white font-bold text-lg py-3 px-8 rounded-xl transition-all duration-300 shadow-[0_4px_14px_rgb(254,165,29,0.3)] hover:shadow-[0_6px_20px_rgb(254,165,29,0.5)] cursor-pointer"
                >
                  {t.reviewsSection.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
