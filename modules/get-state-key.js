/* @flow */

var getStateKey = function (elementKey: ?string): string {
  return elementKey === null || elementKey === undefined || elementKey === '' ?
    'main' :
    elementKey.toString();
};

module.exports = getStateKey;
