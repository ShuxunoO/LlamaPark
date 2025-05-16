const basePath = process.env.BASE_PATH || '';
console.log('env', process.env.NODE_ENV)

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  basePath,
  env: {
    BASE_PATH: basePath,
    IS_PROD: process.env.IS_PROD,
    RPC_URL: process.env.RPC_URL,
    EXPLORER_HOST_BLAST: process.env.EXPLORER_HOST_BLAST,
    EXPLORER_HOST_SCROLL: process.env.EXPLORER_HOST_SCROLL,
    EXPLORER_HOST_ETH: process.env.EXPLORER_HOST_ETH,
    EXPLORER_HOST_ETH_TEST: process.env.EXPLORER_HOST_ETH_TEST,
    EXPLORER_HOST_POLYGON: process.env.EXPLORER_HOST_POLYGON,
  },
  webpack(config) {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )
    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/,
        resourceQuery: { not: /url/ },
        issuer: { not: /\.(css|scss|sass)$/ },
        use: [{ loader: '@svgr/webpack', options: { ref: true } }],
      });
    return config;
  },
};
if (isDev) {
  nextConfig.rewrites = async () => {
    return [
      {
        source: '/api/:path*',
        destination: `http://13.112.138.221:9999/api/:path*`,
      },
    ];
  }
} else {
  nextConfig.output = 'export'
}

module.exports = nextConfig
