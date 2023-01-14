// const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_XUMM_APIKEY: process.env.XUMM_APIKEY,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    const fallback = config.resolve.fallback || {}
    Object.assign(fallback, {
      assert: require.resolve('assert'),
      encoding: require.resolve('encoding'),
      bufferutil: require.resolve('bufferutil'),
      crypto: require.resolve('crypto-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      'null-loader': require.resolve('null-loader'),
      os: require.resolve('os-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      'utf-8-validate': require.resolve('utf-8-validate'),
      ws: require.resolve('xrpl/dist/npm/client/WSWrapper'),
    })
    config.resolve.fallback = fallback
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ])

    // This is deprecated in webpack 5 but alias false does not seem to work
    config.module.rules.push({
      test: /node_modules[\\\/]https-proxy-agent[\\\/]/,
      use: 'null-loader',
    })
    return config
  },
}

module.exports = nextConfig
