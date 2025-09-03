import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: [
    //   "plus.unsplash.com",
    //   "images.unsplash.com",
    //   "res.cloudinary.com",
    //   "i.ibb.co",
    //   "picsum.photos",
    //   "img.freepik.com",
    // ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
