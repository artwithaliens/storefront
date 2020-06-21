/* eslint-disable import/no-extraneous-dependencies */
const deploy = require('shipit-deploy');
const shared = require('shipit-shared');

module.exports = (shipit) => {
  // Load shipit-deploy tasks
  deploy(shipit);
  shared(shipit);

  shipit.task('build', () => {
    shipit.remote(`cd ${shipit.releasePath} && yarn install --frozen-lockfile && yarn build`);
    shipit.emit('built');
  });

  shipit.task('pm2', function task() {
    shipit.log('Launching pm2');
    shipit.remote(
      `cd ${shipit.config.deployTo} && pm2 startOrRestart --env ${shipit.environment} current/ecosystem.json`,
    );
  });

  shipit.on('updated', () => {
    shipit.start('build');
  });

  shipit.on('cleaned', () => {
    shipit.start('pm2');
  });

  shipit.initConfig({
    default: {
      branch: 'master',
      deployTo: '/var/www/storefront',
      keepReleases: 3,
      repositoryUrl: 'https://github.com/artwithaliens/storefront.git',
      shared: {
        dirs: [],
        files: ['.env'],
      },
    },
    production: {
      servers: 'deploy@artwithaliens.com',
    },
  });
};
