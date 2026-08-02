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
    "/solutions/[slug]": ["./generated/solutions/**/*"],
  },
}

export default withBundleAnalyzer(nextConfig)
