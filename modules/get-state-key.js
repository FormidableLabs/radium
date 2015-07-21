/* @flow */

var getStateKey = function (elementKey: ?string): string {
  return elementKey === null || elementKey === undefined ?
    'main' :
    elementKey.toString();
};

module.exports = getStateKey;
