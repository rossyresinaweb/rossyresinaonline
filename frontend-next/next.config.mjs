/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const origin = process.env.STORE_API_ORIGIN || 'http://localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${origin}/api/:path*`
      }
    ];
  }
};

export default nextConfig;
