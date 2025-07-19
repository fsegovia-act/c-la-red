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
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       fs: false,
  //     };
  //   }
  //   return config;
  // },
  // // Para servir en HTTPS en desarrollo (requerido para cámara)
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Permissions-Policy',
  //           value: 'camera=self'
  //         }
  //       ]
  //     }
  //   ];
  // }
};

export default nextConfig;
