/* @flow */

var getStateKey = require('./get-state-key');

var getState = function (
  state: {_radiumStyleState: {[key: string]: {[value: string]: boolean}}},
  elementKey: string,
  value: string
): any {
  var key = getStateKey(elementKey);

  return (
    !!state &&
    !!state._radiumStyleState &&
    !!state._radiumStyleState[key] &&
    state._radiumStyleState[key][value]
  );
};

module.exports = getState;
