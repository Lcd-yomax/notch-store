import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { CartProvider } from '@/lib/CartContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import Script from 'next/script';
import { META_PIXEL_ID } from '@/lib/pixel';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.notch-tech.com'),
  title: {
    default: 'Notch-Tech Maroc | Produits Tech Livraison Partout au Maroc',
    template: '%s | Notch-Tech Maroc'
  },
  alternates: {
    canonical: '/',
  },
  description: "Achetez les meilleurs produits tech au Maroc dès 500 DH. Livraison rapide partout au Maroc, sans frais cachés. Paiement à la réception.",
  keywords: ['électronique', 'produits tech', 'livraison maroc', 'acheter maroc', 'sans frais', 'partout au maroc', 'paiement livraison', 'Notch-Tech'],
  authors: [{ name: 'Notch-Tech' }],
  creator: 'Notch-Tech',
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://www.notch-tech.com',
    title: 'Notch-Tech Maroc | Produits Tech Livraison Partout au Maroc',
    description: 'Achetez les meilleurs produits tech au Maroc dès 500 DH. Livraison rapide partout au Maroc, sans frais cachés. Paiement à la réception.',
    siteName: 'Notch-Tech',
    images: [{
      url: '/images/logo/logo-head.ico',
      width: 1200,
      height: 630,
      alt: 'Notch-Tech Maroc - Produits Tech',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notch-Tech Maroc | Produits Tech Livraison Partout au Maroc',
    description: 'Achetez les meilleurs produits tech au Maroc dès 500 DH. Livraison rapide partout. Paiement à la réception.',
    images: ['/images/logo/logo-head.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo/logo-head.ico',
    apple: '/images/logo/logo-head.ico',
  }
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
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Notch-Tech",
              "url": "https://www.notch-tech.com",
              "logo": "https://www.notch-tech.com/images/logo/logo-head.ico",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+212-667-018042",
                "contactType": "customer service",
                "areaServed": "MA",
                "availableLanguage": ["French", "Arabic"]
              }
            })
          }}
        />
        <Script
          id="json-ld-localbusiness"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Notch-Tech",
              "url": "https://www.notch-tech.com",
              "telephone": "+212-667-018042",
              "email": "contact@notch-tech.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Boulevard Hassan II",
                "addressLocality": "Casablanca",
                "addressCountry": "MA"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
                "opens": "09:00",
                "closes": "21:00"
              },
              "sameAs": [
                "https://www.facebook.com/notchtech.ma",
                "https://www.instagram.com/notchtech_ma"
              ]
            })
          }}
        />
        <Script
          id="json-ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Notch-Tech",
              "url": "https://www.notch-tech.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.notch-tech.com/shop?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="bg-background-light text-slate-900 font-display antialiased selection:bg-primary/30 selection:text-primary min-h-screen flex flex-col">
        <LanguageProvider>
          <CartProvider>
            {children}
            <WhatsAppButton />
          </CartProvider>
        </LanguageProvider>
        <GoogleAnalytics />

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
