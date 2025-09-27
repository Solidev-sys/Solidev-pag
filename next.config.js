/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remover swcMinify - ya no es necesario
  serverExternalPackages: [], // Movido desde experimental.serverComponentsExternalPackages
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
      }
    ]
  }
}

module.exports = nextConfig
