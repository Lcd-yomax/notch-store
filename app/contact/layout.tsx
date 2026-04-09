import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contactez-nous',
  description: 'Une question ? Besoin d\'aide ? Contactez l\'équipe NotchMaroc par email ou par téléphone. Nous vous répondrons dans les plus brefs délais.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
