/* @flow */

const getStateKey = function(renderedElement: any): string {
  return typeof renderedElement.ref === 'string'
    ? renderedElement.ref
    : renderedElement.key;
};

export default getStateKey;
