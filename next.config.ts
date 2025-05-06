import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    domains: ["don-vip-backend-production.up.railway.app"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
