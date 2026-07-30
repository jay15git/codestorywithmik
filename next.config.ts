import type { NextConfig } from "next"
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/companies/[company]": ["./generated/**/*"],
    "/topics/[topic]": ["./generated/**/*"],
  },
}

export default withBundleAnalyzer(nextConfig)
