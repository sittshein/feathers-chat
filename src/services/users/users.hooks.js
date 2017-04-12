'use strict';

const { authenticate } = require('feathers-authentication').hooks;
const { hashPassword } = require('feathers-authentication-local').hooks;
const commonHooks = require('feathers-hooks-common');
const gravatar = require('../../hooks/gravatar');

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [
      hashPassword(),
      commonHooks.iff(
        // If the data contains a github object...
        hook => hook.data.github,
        // Set hook.data.email to the github user's email.
        hook => {
          let emails = hook.data.github.profile.emails;
          if (!emails || !emails.length) {
            throw new Error(`GitHub login for ${hook.data.github.profile.username} failed due to missing email.`);
          }
          hook.data.email = emails[0].value;
        }
      ),
      gravatar()
    ],
    update: [ authenticate('jwt') ],
    patch: [ authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [commonHooks.when(hook => hook.params.provider, commonHooks.discard('password'))],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
