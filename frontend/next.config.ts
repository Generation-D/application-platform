import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', '@logflare/pino-logflare'],
};

export default nextConfig;
