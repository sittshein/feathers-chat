const authenticate = require('../../hooks/authenticate-jwt');

const processMessage = require('../../hooks/process-message');

const populateUser = require('../../hooks/populate-user');

module.exports = {
  before: {
    all: [authenticate(context =>  {
      return {
        issuer: 'someone',
        subject: 'test'
      };
    })],
    find: [],
    get: [],
    create: [processMessage()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populateUser()],
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
