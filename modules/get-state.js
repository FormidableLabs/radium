/* @flow */

var getStateKey = require('./get-state-key');

var VALID_KEYS = [':active', ':focus', ':hover'];

var getState = function (
  state: {_radiumStyleState: {[key: string]: {[value: string]: boolean}}},
  elementKey: string,
  value: string
): boolean {
  if (VALID_KEYS.indexOf(value) === -1) {
    throw new Error('Radium.getState invalid value param: `' + value + '`');
  }

  var key = getStateKey(elementKey);

  return !!(
    state &&
    state._radiumStyleState &&
    state._radiumStyleState[key] &&
    state._radiumStyleState[key][value]
  );
};

module.exports = getState;
