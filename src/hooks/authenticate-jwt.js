const { authenticate } = require('@feathersjs/authentication').hooks;
const { get, set } = require('lodash');

const PATH = 'app.passport._strategies.jwt._verifOpts';

module.exports = getOptions => {
  const authHook = authenticate('jwt');

  return async context => {
    const oldOptions = get(context, PATH);
    const newOptions = getOptions(context);

    set(context, PATH, newOptions);

    const ctx = await authHook(context);

    set(context, PATH, oldOptions);

    return ctx;
  };
};
