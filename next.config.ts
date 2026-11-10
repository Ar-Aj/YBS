import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  redirects() {
    return [{ source: '/services', destination: '/#services', permanent: true }];
  },
};

export default nextConfig;
