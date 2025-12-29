/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // or '5mb', '20mb'
    },
  },
};

module.exports = nextConfig;
