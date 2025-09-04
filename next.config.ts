import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "don-vip-backend-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "don-vip.com",
      },
    ],
  },
  async redirects() {
    return [
      // Remove trailing slashes to prevent duplicates
      {
        source: "/(.*)//",
        destination: "/$1",
        permanent: true,
      },
      // Remove common tracking parameters to prevent duplicate pages
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "utm_source",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "utm_medium",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "utm_campaign",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "utm_content",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "utm_term",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "fbclid",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "query",
            key: "gclid",
          },
        ],
        destination: "/$1",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
        has: [
          {
            type: "query",
            key: "utm_source",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
