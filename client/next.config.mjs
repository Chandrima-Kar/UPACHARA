/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "www.metropolisindia.com", // Your blog image source
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com", // Add iStockPhoto
      },
      {
        protocol: "https",
        hostname: "blogs.biomedcentral.com", // Add iStockPhoto
      },
    ],
  },
};

export default nextConfig;