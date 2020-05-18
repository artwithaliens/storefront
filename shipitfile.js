/* eslint-env node */
/* eslint-disable import/no-extraneous-dependencies */
const deploy = require('shipit-deploy');

module.exports = (shipit) => {
  // Load shipit-deploy tasks
  deploy(shipit);

  shipit.initConfig({
    default: {
      branch: 'master',
      deployTo: '/var/www/storefront',
      repositoryUrl: 'https://github.com/efoken/artwithaliens-storefront.git',
    },
    production: {
      servers: 'deploy@artwithaliens.com',
    },
  });
};
