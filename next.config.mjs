/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsHmrCache: false,
  },
  images: {
    domains: ["api.microlink.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Only add minimal config needed for Botpress
    if (!isServer) {
      // Handle externals for client-side
      config.externals = config.externals || [];
    } else {
      // Prevent server-side bundling of Botpress
      config.externals = [...(config.externals || []), "@botpress/webchat"];
    }

    return config;
  },
};

export default nextConfig;
