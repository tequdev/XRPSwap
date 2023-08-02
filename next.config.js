/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_GA_ID: process.env.GA_ID,
    NEXT_PUBLIC_XUMM_APIKEY: process.env.XUMM_APIKEY,
    XUMM_SECRET: process.env.XUMM_SECRET,
    NEXT_PUBLIC_XRPL_SERVER: process.env.XRPL_SERVER,
  },
}

module.exports = nextConfig
