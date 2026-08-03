import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeetSeek · LeetCode DS & Algo",
    short_name: "LeetSeek",
    description:
      "Browse LeetCode data structures and algorithms solutions by topic, company, and problem.",
    start_url: "/",
    display: "standalone",
    background_color: "#07100a",
    theme_color: "#07100a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
