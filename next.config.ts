import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PDF/DOCX parsers stay on the server and out of the bundler.
  serverExternalPackages: ["unpdf", "mammoth"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
