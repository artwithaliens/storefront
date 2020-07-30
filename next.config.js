const withOffline = require('next-offline');
const { version } = require('./package.json');

module.exports = withOffline({
  target: 'serverless',
  generateSw: false,
  workboxOpts: {
    swSrc: './src/serviceWorker.ts',
    swDest: 'static/service-worker.js',
  },
  env: {
    SITE_URL: process.env.SITE_URL,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_RELEASE: version,
    BRAINTREE_MERCHANT_ID: process.env.BRAINTREE_MERCHANT_ID,
    BRAINTREE_TOKENIZATION_KEY: process.env.BRAINTREE_TOKENIZATION_KEY,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    GA_TRACKING_ID: 'UA-127038775-1',
  },
  rewrites: async () => [
    {
      source: '/service-worker.js',
      destination: '/_next/static/service-worker.js',
    },
  ],
  experimental: {
    plugins: true,
  },
});
