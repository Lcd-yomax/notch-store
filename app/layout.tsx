import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { CartProvider } from '@/lib/CartContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import Script from 'next/script';
import { META_PIXEL_ID } from '@/lib/pixel';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Notch-Tech',
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
      <body className="bg-background-light text-slate-900 font-display antialiased selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
        <LanguageProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
          </CartProvider>
        </LanguageProvider>

        {/* ── Meta Pixel Base Code ─────────────────────────────── */}
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        {/* ─────────────────────────────────────────────────────── */}
      </body>
    </html>
  );
}
