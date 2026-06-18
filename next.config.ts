import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: no-img-element is intentional for DiceBear avatars
    // (DiceBear CDN already optimizes PNG output, next/image would
    //  add unnecessary processing for 40px avatars)
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/**",
      },
    ],
  },
};

export default nextConfig;
