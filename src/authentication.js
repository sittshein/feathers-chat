'use strict';

const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');
const oauth2 = require('feathers-authentication-oauth2');
const GithubStrategy = require('passport-github');
const makeHandler = require('./oauth-handler');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');
  const handler = makeHandler(app);

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  app.configure(oauth2(Object.assign({
    name: 'github',
    Strategy: GithubStrategy,
    handler: handler(config.github.successRedirect)
  }, config.github)));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
