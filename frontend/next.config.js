/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
}

module.exports = withNextIntl(nextConfig);