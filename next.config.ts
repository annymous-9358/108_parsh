import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    remotePatterns.push({
      protocol: "https",
      hostname: url.hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // ignore malformed env value at build time
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
