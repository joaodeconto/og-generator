/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'cdn.linkedin.com', 'pbs.twimg.com', 'graph.facebook.com', 'cdninstagram.com']
  }
};

module.exports = nextConfig;