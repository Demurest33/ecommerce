/** @type {import('next').NextConfig} */
const nextConfig = {
  //https://via.placeholder.com/150
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgur.com",
      },
    ],
  },
};

export default nextConfig;
