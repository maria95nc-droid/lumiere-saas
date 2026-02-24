/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Needed for prisma.config.ts support in Prisma 5.14+
  },
};

module.exports = nextConfig;
