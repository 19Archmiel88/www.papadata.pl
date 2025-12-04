/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  reactStrictMode: true,
  transpilePackages: ['@papadata/i18n']
};

export default nextConfig;
