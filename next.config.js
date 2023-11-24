/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'kyrre.dev',
      'www.kyrre.dev',
      'picsum.photos', // for testing
    ],
  },
};

module.exports = nextConfig;
