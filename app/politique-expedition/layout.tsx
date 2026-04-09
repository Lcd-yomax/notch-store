import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique d\'expédition',
  description: 'Informations détaillées sur les zones de livraison, les délais et les frais d\'expédition pour toutes vos commandes sur NotchMaroc.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
