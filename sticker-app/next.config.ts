import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp is a native module; keep it external to the server bundle so the
  // prebuilt binaries are used at runtime instead of being bundled.
  serverExternalPackages: ["sharp"],
};

export default nextConfig;
