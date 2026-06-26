import type { NextConfig } from "next";

// Deployed to GitHub Pages at https://jatinli.github.io/space-scape/
const repo = "space-scape";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
