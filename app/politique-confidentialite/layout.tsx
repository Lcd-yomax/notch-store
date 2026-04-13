import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Découvrez comment Notch collecte, utilise et protège vos données personnelles lorsque vous utilisez notre boutique en ligne.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
