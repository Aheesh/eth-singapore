/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      '@napi-rs/canvas': 'commonjs @napi-rs/canvas',
    });
    return config;
  },
}

module.exports = nextConfig 