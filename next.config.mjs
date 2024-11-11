/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "phinf.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
