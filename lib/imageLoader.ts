/**
 * Custom image loader for Next.js.
 *
 * - Supabase URLs: already transformed by Supabase's Image API
 *   (contain ?width=...&quality=... params), so we return them as-is
 *   to avoid double-optimization and the private-IP proxy error.
 * - All other URLs (local static assets, etc.): returned as-is since
 *   they are served directly from the public folder.
 */
export default function imageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return src;
}
