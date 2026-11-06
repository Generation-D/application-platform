import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "@logflare/pino-logflare"],
  cacheComponents: true,
};

export default nextConfig;
