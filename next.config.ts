import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  redirects() {
    return [{ source: '/services', destination: '/#services', permanent: true }];
  },
};

export default nextConfig;
