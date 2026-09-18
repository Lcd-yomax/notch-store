import type { Metadata } from 'next';
import PacksListView from '@/components/packs/PacksListView';
import { getPacks } from '@/lib/catalog/packs';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Packs et offres groupées',
  description: 'Économisez en achetant vos produits en pack : smartphones, chargeurs, écouteurs et accessoires à prix réduit.',
  alternates: { canonical: '/packs' },
};

export default async function PacksPage() {
  const packs = await getPacks();
  return <PacksListView packs={packs} />;
}
