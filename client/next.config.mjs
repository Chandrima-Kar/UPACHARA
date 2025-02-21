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
      {
        protocol: "https",
        hostname: "content.jdmagicbox.com", // Add iStockPhoto
      },
      {
        protocol: "https",
        hostname: "mymind.org", // Added new image source
      },
      {
        protocol: "https",
        hostname: "www.bls.gov", // Added new image source
      },
      {
        protocol: "https",
        hostname: "www.verywellfit.com", // Added new image source
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // Added new image source
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Added new image source
      },
    ],
  },
};

export default nextConfig;
