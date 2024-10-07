/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "backend.tempslifestyle.com"],
  },
  env: {
    NEXT_PUBLIC_SANITY_API_READ_TOKEN:
      process.env.NEXT_PUBLIC_SANITY_API_READ_TOKEN,
  },
};

export default nextConfig;
