import type { NextConfig } from "next";

// https://nextjs.org/docs/app/guides/package-bundling#analyzing-javascript-bundles
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  serverExternalPackages: ["pino", "pino-pretty"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default withBundleAnalyzer(nextConfig);
