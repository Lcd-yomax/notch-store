import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termes et Conditions',
  description: 'Consultez les termes et conditions d\'utilisation du site Notch. Toutes les règles encadrant vos commandes et l\'utilisation de notre plateforme.',
  robots: {
    index: false,
    follow: true,
  }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
