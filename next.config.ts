import type { NextConfig } from "next"
import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  serverExternalPackages: ["ts-fsrs"],
  outputFileTracingIncludes: {
    "/problems": ["./generated/**/*"],
    "/companies": ["./generated/**/*"],
    "/companies/[company]": ["./generated/**/*"],
    "/topics/[topic]": ["./generated/**/*"],
    "/solutions/[slug]": ["./generated/**/*"],
    "/patterns/[slug]": ["./generated/**/*"],
    "/plans/[slug]": ["./generated/**/*"],
  },
}

export default withBundleAnalyzer(nextConfig)
