/* @flow */

'use strict';

var ExecutionEnvironment = require('exenv');

var _matchMediaFunction = ExecutionEnvironment.canUseDOM &&
  window &&
  window.matchMedia;
var _mediaQueryAliases = new Map();

module.exports = {
  canMatchMedia () {
    return typeof _matchMediaFunction === 'function';
  },

  matchMedia (query: string) {
    return _matchMediaFunction(query);
  },

  setMatchMedia (nextMatchMediaFunction: Function) {
    _matchMediaFunction = nextMatchMediaFunction;
  },

  setMediaQueryAlias (alias: string, query: string) {
    if (alias.indexOf('@') !== 0) {
      throw new Error('alias should start with "@"');
    }
    if (query.indexOf('@media ') !== 0) {
      throw new Error('query should start with "@media "');
    }

    _mediaQueryAliases.set(alias, query);
  },

  getMediaQueryByAlias (alias: string) {
    return _mediaQueryAliases.get(alias);
  },

  isMediaQueryAlias (alias: string):boolean {
    return _mediaQueryAliases.has(alias);
  }
};
