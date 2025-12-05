/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // na hostingu typu Cyber_Folks nie ma serwera image optimization
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
