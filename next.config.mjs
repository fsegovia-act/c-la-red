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
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; " +
              "connect-src 'self' https://cdn.jsdelivr.net; " +
              "img-src 'self' data:; " +
              "style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
