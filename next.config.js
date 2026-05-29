/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  env: {
    PI_API_KEY: process.env.PI_API_KEY,
    PI_NETWORK: process.env.PI_NETWORK || 'testnet',
  },
}

module.exports = nextConfig
