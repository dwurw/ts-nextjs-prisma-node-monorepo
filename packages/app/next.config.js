/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_IMAGEKIT_PUBLIC_URL: process.env.NEXT_IMAGEKIT_PUBLIC_URL,
    NEXT_IMAGEKIT_PUBLIC_KEY: process.env.NEXT_IMAGEKIT_PUBLIC_KEY,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
