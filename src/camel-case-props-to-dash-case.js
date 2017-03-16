/* @flow */

const _camelCaseRegex = /([a-z])?([A-Z])/g;

const _camelCaseReplacer = function(match, p1, p2) {
  return (p1 || '') + '-' + p2.toLowerCase();
};

const _camelCaseToDashCase = function(s) {
  return s.replace(_camelCaseRegex, _camelCaseReplacer);
};

const camelCasePropsToDashCase = function(prefixedStyle: Object): Object {
  // Since prefix is expected to work on inline style objects, we must
  // translate the keys to dash case for rendering to CSS.
  return Object.keys(prefixedStyle).reduce(
    (result, key) => {
      let dashCaseKey = _camelCaseToDashCase(key);

      // Fix IE vendor prefix
      if (/^ms-/.test(dashCaseKey)) {
        dashCaseKey = `-${dashCaseKey}`;
      }

      result[dashCaseKey] = prefixedStyle[key];
      return result;
    },
    {},
  );
};

export default camelCasePropsToDashCase;
