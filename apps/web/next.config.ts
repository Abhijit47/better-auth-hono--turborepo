import { loadEnvConfig } from '@next/env';
import type { NextConfig } from 'next';

loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
