/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',     // Google user profile images
      'maps.googleapis.com',           // Google Maps photos
      'graph.facebook.com',            // Facebook profile images
      'platform-lookaside.fbsbx.com',  // Facebook CDN
      'scontent.xx.fbcdn.net',         // Facebook content CDN
      'res.cloudinary.com',            // If you use Cloudinary for image hosting
      'avatars.githubusercontent.com',  // GitHub avatars (if needed)
      'images.unsplash.com',           // Unsplash images (for placeholders)
      's3.amazonaws.com'               // If you use AWS S3 for storage
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
        pathname: '**',
      }
    ]
  }
}

module.exports = nextConfig