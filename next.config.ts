import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    webpack: (config) => {
    config.resolve.symlinks = false; // avoid readlink issue
    return config;
  },
};

export default nextConfig;
