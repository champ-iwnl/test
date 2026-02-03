require('dotenv').config({ path: '../.env' })

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  transpilePackages: [],
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tanstack/react-query', 'framer-motion', 'axios'],
  },
  // Compression
  compress: true,
  // Modern build target
  swcMinify: true,
}

module.exports = nextConfig