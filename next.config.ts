import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // 90 is used for screenshots and certificates, where text has to stay sharp
  images: { qualities: [75, 90] },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules (*.module.css) keep their own scoped class names, so skip Tailwind for them
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
