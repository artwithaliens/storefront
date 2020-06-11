const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withOffline = require('next-offline');
const merge = require('lodash/merge');
const { version } = require('./package.json');

module.exports = withOffline({
  target: 'serverless',
  generateSw: false,
  workboxOpts: {
    swSrc: './src/serviceWorker.ts',
    swDest: 'public/service-worker.js',
    exclude: [/.+error\.js$/, /\.map$/],
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
  webpack: (config) =>
    merge(
      config,
      process.env.SENTRY_DSN &&
        process.env.SENTRY_ORG &&
        process.env.SENTRY_PROJECT &&
        process.env.SENTRY_AUTH_TOKEN &&
        process.env.NODE_ENV === 'production' && {
          plugins: [
            new SentryWebpackPlugin({
              include: '.next',
              ignore: ['node_modules'],
              urlPrefix: '~/_next',
            }),
          ],
        },
    ),
  experimental: {
    plugins: true,
  },
});
