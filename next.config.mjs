/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c-la-red.s3.us-east-2.amazonaws.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
