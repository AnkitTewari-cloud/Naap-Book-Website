import type { NextConfig } from "next";
import path from "path";

/** Pin tracing root to this app (avoids wrong monorepo lockfile parent). */
const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  /** Lower dev memory use (helps avoid OOM on Windows). */
  experimental: {
    webpackMemoryOptimizations: true,
  },
  async redirects() {
    return [
      {
        source: "/insights",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
