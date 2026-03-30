import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { CartProvider } from '@/lib/CartContext';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Notch-Tech | Premium Tech E-commerce',
  description: 'Votre première destination pour les derniers appareils électroniques et accessoires intelligents au Maroc.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${manrope.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo/logo-head.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
