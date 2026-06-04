import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'localhost:9002',
      '*.cloudworkstations.dev',
      '*.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev'
    ],
  },
};

export default nextConfig;
