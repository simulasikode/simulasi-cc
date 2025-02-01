import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },

  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
