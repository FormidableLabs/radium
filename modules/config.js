/* @flow */

var ExecutionEnvironment = require('exenv');

var _matchMediaFunction = ExecutionEnvironment.canUseDOM &&
  window &&
  window.matchMedia &&
  (mediaQueryString => window.matchMedia(mediaQueryString));

module.exports = {
  canMatchMedia (): boolean {
    return typeof _matchMediaFunction === 'function';
  },

  matchMedia (query: string): Function {
    return _matchMediaFunction(query);
  },

  setMatchMedia (nextMatchMediaFunction: Function) {
    _matchMediaFunction = nextMatchMediaFunction;
  }
};
