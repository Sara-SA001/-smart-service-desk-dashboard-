/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://62.171.153.198:18473/:path*'
      }
    ]
  }
}

module.exports = nextConfig