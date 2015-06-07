/* @flow */

'use strict';

var VALID_KEYS = [':active', ':focus', ':hover'];

var getState = function (
  state: {_radiumStyleState: Object<string, Object<string, boolean>>},
  elementKey: string,
  value: string,
): boolean {
  elementKey = elementKey || 'main';

  if (VALID_KEYS.indexOf(value) === -1) {
    throw new Error('Radium.getState invalid value param: `' + value + '`');
  }

  return !!(
    state &&
    state._radiumStyleState &&
    state._radiumStyleState[elementKey] &&
    state._radiumStyleState[elementKey][value]
  ) || false;
};

module.exports = getState;
