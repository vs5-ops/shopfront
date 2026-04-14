/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "http://localhost:3000",
        "*.vercel.app",
        process.env.NEXT_PUBLIC_APP_URL || ""
      ].filter(Boolean)
    }
  },
  async redirects() {
    return [];
  }
};

export default nextConfig;
