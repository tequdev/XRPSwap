/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_XUMM_APIKEY: process.env.XUMM_APIKEY,
    XUMM_SECRET: process.env.XUMM_SECRET,
  },
}

module.exports = nextConfig
