import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/checkout/', '/success/'], // Block checkout/success pages to avoid duplicate content/crawling 
    },
    sitemap: 'https://notchmaroc.ma/sitemap.xml',
  };
}
