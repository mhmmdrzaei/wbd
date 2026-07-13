import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep serverless bundles scoped to this project (multiple lockfiles exist above).
  outputFileTracingRoot: projectRoot,
  images: {
    // Serve/resize images straight from Sanity's CDN via a custom loader,
    // bypassing Vercel's image optimization (reduces edge + function usage).
    loader: 'custom',
    loaderFile: './src/lib/sanity-image-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io'
      }
    ]
  }
};

export default nextConfig;
