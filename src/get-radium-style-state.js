/* @flow */

const getRadiumStyleState = function(component: any) {
  return component._lastRadiumState ||
  (component.state && component.state._radiumStyleState) || {};
};

export default getRadiumStyleState;
