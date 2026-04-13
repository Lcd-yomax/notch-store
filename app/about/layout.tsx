import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À propos de nous',
  description: 'Découvrez l\'histoire de Notch, notre équipe et les valeurs qui nous guident pour vous offrir la meilleure expérience technologique au Maroc.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
