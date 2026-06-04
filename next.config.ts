
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1779520840203.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev',
      'https://9002-firebase-studio-1779520840203.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev',
      'https://localhost:9002',
      'localhost:9002'
    ],
  },
};

export default nextConfig;
