import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PackDetailView from '@/components/packs/PackDetailView';
import { getPack } from '@/lib/catalog/packs';

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

// Rendered on first visit, then cached and revalidated (ISR), like product pages
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const pack = await getPack(slug);
  if (!pack) return { title: 'Pack introuvable' };

  const description =
    pack.description?.slice(0, 160) ||
    `${pack.name} : ${pack.items.map((item) => item.product_name).join(' + ')}${pack.discount_percent > 0 ? ` à -${pack.discount_percent}%` : ''}.`;

  return {
    title: pack.name,
    description,
    alternates: { canonical: `/packs/${encodeURIComponent(pack.slug)}` },
    openGraph: {
      title: pack.name,
      description,
      images: pack.image_url ? [pack.image_url] : pack.items.map((i) => i.thumbnail_url).filter((u): u is string => !!u).slice(0, 1),
    },
  };
}

export default async function PackPage({ params }: { params: Params }) {
  const { slug } = await params;
  const pack = await getPack(slug);
  if (!pack) notFound();
  return <PackDetailView pack={pack} />;
}
