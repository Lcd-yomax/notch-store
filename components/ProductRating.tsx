import { Star } from 'lucide-react';
import type { CardProduct } from '@/lib/catalog/types';

export default function ProductRating({ product }: { product: CardProduct }) {
  const stars = (product.reviews ?? []).map((review) => Number(review.stars)).filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);
  if (!stars.length) return null;
  const average = stars.reduce((sum, value) => sum + value, 0) / stars.length;
  return (
    <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
      <Star size={16} fill="currentColor" strokeWidth={0} className="text-amber-400" aria-hidden="true" />
      <span>{average.toFixed(1)} / 5</span><span className="font-normal text-slate-500">({stars.length})</span>
    </div>
  );
}
