import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catégories',
  description: 'Découvrez toutes nos catégories de produits électroniques et accessoires intelligents. Écouteurs, montres connectées, chargeurs et plus encore.',
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
