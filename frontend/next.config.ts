import type { NextConfig } from "next";

const cmsUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL ?? "http://localhost:3001";
const cmsHost = (() => {
  try {
    return new URL(cmsUrl).hostname;
  } catch {
    return "localhost";
  }
})();

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: cmsHost },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "cms" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
