/**
 * Supabase Image Transformation Utility
 *
 * Converts a Supabase Storage URL to use Supabase's built-in Image Transformation
 * API, which resizes and compresses images server-side before delivery.
 *
 * Original:    /storage/v1/object/public/bucket/path.png
 * Transformed: /storage/v1/render/image/public/bucket/path.png?width=W&quality=Q
 *
 * Docs: https://supabase.com/docs/guides/storage/serving/image-transformations
 */

interface ImageTransformOptions {
  /** Target width in pixels. Height scales automatically. */
  width?: number;
  /** Quality 1–100. 75 is a good balance of quality and size. */
  quality?: number;
  /** Resize mode: 'cover' | 'contain' | 'fill'. Default: 'cover' */
  resize?: 'cover' | 'contain' | 'fill';
}

/**
 * Returns an optimized Supabase image URL.
 * Falls back to the original URL if it's not a Supabase Storage URL.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: ImageTransformOptions = {}
): string {
  if (!url) return '';

  const { width = 600, quality = 75, resize = 'contain' } = options;

  // Only transform Supabase storage URLs
  if (!url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }

  const transformedUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );

  const paramsObj: Record<string, string> = {
    width: String(width),
    quality: String(quality),
    resize: resize
  };
  
  const params = new URLSearchParams(paramsObj);

  return `${transformedUrl}?${params.toString()}`;
}

/**
 * Pre-defined size presets for common use cases.
 */
export const ImageSizes = {
  /** Tiny thumbnail: search results, cart items */
  thumbnail: (url: string) => getOptimizedImageUrl(url, { width: 80, quality: 70 }),
  /** Small card: best sellers, category slider */
  small: (url: string) => getOptimizedImageUrl(url, { width: 300, quality: 75 }),
  /** Medium card: shop grid, product listings */
  medium: (url: string) => getOptimizedImageUrl(url, { width: 500, quality: 80 }),
  /** Large: featured products, hero images */
  large: (url: string) => getOptimizedImageUrl(url, { width: 800, quality: 80 }),
  /** Full product detail page */
  full: (url: string) => getOptimizedImageUrl(url, { width: 1200, quality: 85 }),
};
