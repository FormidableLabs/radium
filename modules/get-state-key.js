/* @flow */

const getStateKey = function(elementKey: ?string): string {
  return elementKey === null || elementKey === undefined ?
    'main' :
    elementKey.toString();
};

export default getStateKey;
