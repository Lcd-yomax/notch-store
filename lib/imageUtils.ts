/**
 * Image URL utility.
 *
 * Next.js <Image> with unoptimized:false handles all resizing, WebP conversion,
 * and caching via /_next/image. We just need to supply the raw Supabase storage
 * URL — the width/quality decisions are made by Next.js using each component's
 * `sizes` prop at request time.
 *
 * The named presets (thumbnail / small / medium / large / full) are kept so that
 * call-sites are self-documenting, and so a future switch to Supabase Pro
 * transformations only requires changing this one file.
 */

export function getOptimizedImageUrl(url: string | null | undefined): string {
  return url ?? '';
}

export const ImageSizes = {
  thumbnail: (url: string) => url ?? '',
  small:     (url: string) => url ?? '',
  medium:    (url: string) => url ?? '',
  large:     (url: string) => url ?? '',
  full:      (url: string) => url ?? '',
};
