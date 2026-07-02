import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kimtv-oss.99kimtvs.top",
      },
      {
        protocol: "https",
        hostname: "oss.fqhur.com",
      },
      {
        protocol: "https",
        hostname: "imga.fqhur.com",
      },
    ],
  },
}

export default nextConfig
