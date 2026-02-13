const checkEnvVariables = require('./check-env-variables')

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Enable image optimization
    unoptimized: false,
    qualities: [25, 50, 75, 85, 100],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      // Cloudinary CDN
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dllzefagw'}/**`,
      },
      // Medusa S3 images (fallback)
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
      },
      // BlackEyesArtisan API (for product images)
      {
        protocol: 'https',
        hostname: 'api.blackeyesartisan.shop',
      },
      // Strapi CMS (for uploaded media like logo)
      {
        protocol: 'https',
        hostname: 'cms.blackeyesartisan.shop',
      },
      // Legacy support for SPACE_DOMAIN env vars (now point to Cloudinary)
      ...(process.env.NEXT_PUBLIC_SPACE_DOMAIN
        ? [
            {
              protocol: 'https',
              hostname: process.env.NEXT_PUBLIC_SPACE_DOMAIN,
            },
          ]
        : []),
      ...(process.env.NEXT_PUBLIC_CDN_SPACE_DOMAIN &&
      process.env.NEXT_PUBLIC_CDN_SPACE_DOMAIN !== process.env.NEXT_PUBLIC_SPACE_DOMAIN
        ? [
            {
              protocol: 'https',
              hostname: process.env.NEXT_PUBLIC_CDN_SPACE_DOMAIN,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
