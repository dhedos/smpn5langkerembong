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
      '6000-firebase-studio-1779520840203.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev',
      'https://6000-firebase-studio-1779520840203.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev',
      'localhost:9002'
    ],
  },
};

export default nextConfig;