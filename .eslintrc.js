/* eslint-env node */
const { getExtendsList } = require('@airbnb/config-eslint');

module.exports = {
  root: true,
  extends: getExtendsList({ next: true, node: false, prettier: true, typescript: true }),
  plugins: ['@next/next'],
  globals: {
    paypal: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    linkComponents: ['Button', 'Link'],
  },
  rules: {
    camelcase: 'off',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }],
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-no-literals': 'off',
    '@next/next/no-css-tags': 'error',
    '@next/next/no-sync-scripts': 'error',
  },
};
