import { Metadata } from 'next';
import { supabase } from '@/lib/supabase/client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const { data: products } = await supabase
      .from('products')
      .select('name, description, thumbnail_url')
      .eq(isUUID ? 'id' : 'slug', id)
      .limit(1);

    if (!products || products.length === 0) {
      return {
        title: 'Produit introuvable | Notch-Tech',
        description: 'Ce produit n\'est plus disponible.',
      };
    }

    const product = products[0];

    // Strip HTML from description for meta description
    const cleanDescription = (product.description || '').replace(/<[^>]*>?/gm, '').substring(0, 160) + '...';

    return {
      title: `${product.name} | Notch-Tech`,
      description: cleanDescription,
      openGraph: {
        title: `${product.name} | Notch-Tech`,
        description: cleanDescription,
        images: product.thumbnail_url ? [product.thumbnail_url] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Notch-Tech`,
        description: cleanDescription,
        images: product.thumbnail_url ? [product.thumbnail_url] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Produit | Notch-Tech',
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
