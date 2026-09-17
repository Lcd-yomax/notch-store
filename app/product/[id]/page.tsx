import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailView from '@/components/product/ProductDetailView';
import { getApprovedReviews, getProductDetail } from '@/lib/catalog/queries';
import type { ProductDetail, PublicReview } from '@/lib/catalog/types';
import {
  CONDITIONS,
  cardPricing,
  defaultVariation,
  formatStorage,
  galleryFor,
  isPhone,
  ramsOf,
  storagesOf,
  totalStock,
} from '@/lib/catalog/variants';
import { SITE_URL } from '@/lib/site';

export const revalidate = 60;

type Params = Promise<{ id: string }>;

// No pages at build time: each product is rendered on first visit, then cached and revalidated (ISR).
export async function generateStaticParams() {
  return [];
}

const CONDITION_LABELS = { neuf: 'Neuf', reconditionne: 'Reconditionné', occasion: 'Occasion' } as const;

const stripHtml = (html: string | null) => (html ?? '').replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();

/** "Samsung Galaxy A55 5G 256 Go": brand prefix and storages, unless already in the name. */
function seoName(product: ProductDetail) {
  const name = product.name.trim();
  const lower = name.toLowerCase().replace(/\s+/g, ' ');
  const brand = product.brands?.name;
  const withBrand = brand && !lower.startsWith(brand.toLowerCase()) ? `${brand} ${name}` : name;
  if (!isPhone(product.public_variations)) return withBrand;

  const storages = storagesOf(product.public_variations)
    .map((gb) => formatStorage(gb))
    .filter((label) => !lower.includes(label.toLowerCase()));
  return [withBrand, storages.join(' / ')].filter(Boolean).join(' ');
}

function ratingOf(reviews: PublicReview[]) {
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.stars, 0) / count : 0;
  return { count, average: Math.round(average * 10) / 10 };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await getProductDetail((await params).id);
  if (!product) {
    return { title: 'Produit introuvable', description: "Ce produit n'est plus disponible." };
  }

  const title = seoName(product);
  let description: string;

  if (product.hide_price && isPhone(product.public_variations)) {
    const vs = product.public_variations;
    const rams = ramsOf(vs).map((gb) => `${formatStorage(gb)} de RAM`);
    const conditions = CONDITIONS.filter((c) => vs.some((v) => v.condition === c)).map((c) => CONDITION_LABELS[c]);
    const warranty = Math.max(0, ...vs.map((v) => v.warranty_months ?? 0));
    description = [
      `${title}${rams.length ? `, ${rams.join(' / ')}` : ''}`,
      conditions.length ? `${conditions.join(', ')}.` : '',
      warranty ? `Garantie ${warranty} mois.` : '',
      'Livraison partout au Maroc avec Notch-Tech.',
    ]
      .filter(Boolean)
      .join(' ');
  } else {
    const text = stripHtml(product.description);
    description = text.length > 160 ? `${text.substring(0, 157)}...` : text;
  }

  const image = galleryFor(product.product_images, null, product.thumbnail_url)[0] ?? product.thumbnail_url;
  const images = image ? [image] : [];

  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title, description, images, type: 'website', url: `/product/${product.slug}` },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await getProductDetail((await params).id);
  if (!product) notFound();

  const reviews = await getApprovedReviews(product.id);
  const rating = ratingOf(reviews);

  const url = `${SITE_URL}/product/${product.slug}`;
  const phone = isPhone(product.public_variations);
  const availability = phone || totalStock(product.public_variations) > 0
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock';
  const pricing = cardPricing(product);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: seoName(product),
    image: galleryFor(product.product_images, null, product.thumbnail_url).slice(0, 5),
    description: stripHtml(product.description).substring(0, 5000) || undefined,
    sku: defaultVariation(product.public_variations, phone)?.sku,
    ...(product.brands && { brand: { '@type': 'Brand', name: product.brands.name } }),
    ...(rating.count > 0 && {
      aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.average, reviewCount: rating.count, bestRating: 5, worstRating: 1 },
    }),
    // Hidden prices: availability only, the price never reaches the page.
    offers:
      !product.hide_price && pricing
        ? { '@type': 'Offer', url, priceCurrency: 'MAD', price: pricing.price.toString(), availability }
        : { '@type': 'Offer', url, availability },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProductDetailView product={product} reviews={reviews.slice(0, 10)} rating={rating} />
    </>
  );
}
