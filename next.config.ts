import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  compiler: {
    // Strip all console.* calls in production builds — saves ~10–20KB
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Resize originals to the component's `sizes` and cache WebP responses.
  // Supabase object URLs return the original upload, not a resized image
  // (Supabase image transformations are not enabled on this project).
  images: {
    unoptimized: false,
    formats: ['image/webp'],
    qualities: [75, 80],
    dangerouslyAllowSVG: false,
    // Some networks reach Supabase (Cloudflare) through NAT64, so its hostname resolves to
    // 64:ff9b::/96 addresses, which Next 16 treats as private and refuses to fetch ("url" parameter
    // is not allowed). The optimizer can still only fetch the exact hosts listed below.
    dangerouslyAllowLocalIP: true,
    // Supabase sends `cache-control: no-cache`, so the default 4h TTL would re-download the
    // (multi-MB) originals every 4 hours. Uploads get unique UUID names, so their content never
    // changes at a given URL. Local /images files: use a new file name when replacing one.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vjglogcahlggqvzlvlrx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  output: 'standalone',
  turbopack: {},
  webpack: (config: any, { dev }: any) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify — file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default withBundleAnalyzer(nextConfig);
