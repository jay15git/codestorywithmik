import type { NextConfig } from "next"
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/companies/[company]": [
      "./generated/**/*",
      "./lib/content/problem-difficulties.json",
    ],
    "/topics/[topic]": [
      "./generated/**/*",
      "./lib/content/problem-difficulties.json",
    ],
  },
}

export default withBundleAnalyzer(nextConfig)
