const withOffline = require('next-offline');
const { version } = require('./package.json');

module.exports = withOffline({
  target: 'serverless',
  generateSw: false,
  workboxOpts: {
    swSrc: './src/serviceWorker.ts',
    swDest: 'static/serviceWorker.js',
  },
  env: {
    VERCEL_URL: process.env.VERCEL_URL,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: version,
    BRAINTREE_MERCHANT_ID: process.env.BRAINTREE_MERCHANT_ID,
    BRAINTREE_TOKENIZATION_KEY: process.env.BRAINTREE_TOKENIZATION_KEY,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    GA_TRACKING_ID: 'UA-127038775-1',
  },
  images: {
    domains: [new URL(process.env.GRAPHQL_URL).hostname],
  },
  rewrites: async () => [
    {
      source: '/serviceWorker.js',
      destination: '/_next/static/serviceWorker.js',
    },
    {
      source: '/checkout',
      destination: '/checkout/billing-address',
    },
  ],
  future: {
    webpack5: true,
  },
  experimental: {
    plugins: true,
  },
});
