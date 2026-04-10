import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Images: Supabase already fully optimizes product images via its own
  // Image Transformation API (see lib/imageUtils.ts). Local assets (logos,
  // hero) are small static files. Setting unoptimized:true skips Next.js's
  // /_next/image proxy entirely — this eliminates both the private-IP error
  // on Supabase CDN and the loader-width warnings.
  images: {
    unoptimized: true,
    qualities: [75, 80],
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vjglogcahlggqvzlvlrx.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  turbopack: {},
  webpack: (config: any, {dev}: any) => {
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
