'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { pixelContact } from '@/lib/pixel';
import { SITE_URL, WHATSAPP_NUMBER } from '@/lib/site';
import type { PublicVariation } from '@/lib/catalog/types';
import { formatStorage } from '@/lib/catalog/variants';

interface Props {
  product: { id: string; name: string; slug: string };
  variation: PublicVariation | null;
  className?: string;
}

export default function WhatsAppPriceButton({ product, variation, className = '' }: Props) {
  const { t } = useLanguage();

  const buildUrl = (pageUrl: string) => {
    const m = t.phone.whatsappMessage;
    const lines = [
      m.intro,
      `${m.product}: ${product.name}`,
      variation?.storage_gb != null ? `${m.storage}: ${formatStorage(variation.storage_gb, t.phone.units)}` : null,
      variation?.ram_gb != null ? `${m.ram}: ${formatStorage(variation.ram_gb, t.phone.units)}` : null,
      variation?.color ? `${m.color}: ${variation.color}` : null,
      variation && variation.condition !== 'neuf' ? `${m.condition}: ${t.phone.conditions[variation.condition]}` : null,
      `${m.link}: ${pageUrl}`,
    ].filter(Boolean);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // Rendered with the canonical URL (same on server and client); the click swaps in
  // the real address bar URL, which carries the selected variant (?v=SKU).
  const canonical = `${SITE_URL}/product/${encodeURIComponent(product.slug)}${variation ? `?v=${encodeURIComponent(variation.sku)}` : ''}`;

  return (
    <a
      href={buildUrl(canonical)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.currentTarget.href = buildUrl(window.location.href);
        pixelContact({ id: product.id, name: product.name, sku: variation?.sku });
      }}
      className={`bg-[#25D366] hover:bg-[#1ebe5b] text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#25D366]/30 ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 shrink-0" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
      {t.phone.askWhatsApp}
    </a>
  );
}
