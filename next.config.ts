import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public feature flags available at runtime via `process.env.NEXT_PUBLIC_*`
  env: {
    // Toggle for normal staff login flow (default: enabled)
    NEXT_PUBLIC_FLAG_STAFF_LOGIN: process.env.NEXT_PUBLIC_FLAG_STAFF_LOGIN ?? 'true',
    // Toggle for executive (privileged) login flow (default: disabled)
    NEXT_PUBLIC_FLAG_EXEC_LOGIN: process.env.NEXT_PUBLIC_FLAG_EXEC_LOGIN ?? 'false',
  },
};

export default nextConfig;
