/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds (use with caution)
  },
  // Add any other Next.js configuration options here
};

export default nextConfig;
