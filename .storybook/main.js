const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      plugins: config.resolve.plugins.concat([
        new TsconfigPathsPlugin({ extensions: config.resolve.extensions }),
      ]),
    },
  }),
};
