/* @flow */

const getStateKey = function(renderedElement: ?string): string {
  return typeof renderedElement.ref === 'string'
    ? renderedElement.ref
    : renderedElement.key;
};

export default getStateKey;
