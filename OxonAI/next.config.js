/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Skip prerendering API routes during build
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    // Don't fail the build if environment variables are missing
    // They will be checked at runtime instead
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Externalize modules that shouldn't be bundled during build
            config.externals = [...(config.externals || [])];
        }
        return config;
    },
}

module.exports = nextConfig
