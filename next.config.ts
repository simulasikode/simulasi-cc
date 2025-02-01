import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
  ...withMDX({
    extension: /\.mdx$/,
    options: {},
  }),
};

export default withMDX()(nextConfig);
