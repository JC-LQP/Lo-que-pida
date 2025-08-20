/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  experimental: {
    optimizeCss: true,
  },
  // Ensure proper static generation
  output: 'standalone',
};

module.exports = nextConfig;
