import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "",
      },
    ],
    qualities: [25, 50, 75, 100],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
