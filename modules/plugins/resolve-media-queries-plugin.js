/** @flow */

import type {MatchMediaType} from '../config';
import type {PluginConfig, PluginResult} from '.';

var _windowMatchMedia;
var _getWindowMatchMedia = function (ExecutionEnvironment) {
  if (_windowMatchMedia === undefined) {
    _windowMatchMedia = !!ExecutionEnvironment.canUseDOM &&
      !!window &&
      !!window.matchMedia &&
      (mediaQueryString => window.matchMedia(mediaQueryString)) ||
      null;
  }
  return _windowMatchMedia;
};

var resolveMediaQueries = function ({
  ExecutionEnvironment,
  getComponentField,
  getGlobalState,
  config,
  mergeStyles,
  setState,
  style
}: PluginConfig): PluginResult {
  var newComponentFields = {};
  var newStyle = style;
  var matchMedia: ?MatchMediaType = config.matchMedia ||
    _getWindowMatchMedia(ExecutionEnvironment);
  if (!matchMedia) {
    return newStyle;
  }

  var mediaQueryListByQueryString =
    getGlobalState('mediaQueryListByQueryString') || {};

  Object.keys(style)
  .filter(function (name) { return name.indexOf('@media') === 0; })
  .map(function (query) {
    var mediaQueryStyles = style[query];
    query = query.replace('@media ', '');

    // Create a global MediaQueryList if one doesn't already exist
    var mql = mediaQueryListByQueryString[query];
    if (!mql && matchMedia) {
      mediaQueryListByQueryString[query] = mql = matchMedia(query);
    }

    var listenersByQuery =
      getComponentField('_radiumMediaQueryListenersByQuery');

    if (!listenersByQuery || !listenersByQuery[query]) {
      var listener = () => setState(query, mql.matches, '_all');
      mql.addListener(listener);
      newComponentFields._radiumMediaQueryListenersByQuery = {
        ...listenersByQuery
      };
      newComponentFields._radiumMediaQueryListenersByQuery[query] = {
        remove () { mql.removeListener(listener); }
      };
    }

    // Apply media query states
    if (mql.matches) {
      newStyle = mergeStyles([newStyle, mediaQueryStyles]);
    }
  });

  // Remove media queries
  newStyle = Object.keys(newStyle).reduce(
    (styleWithoutMedia, key) => {
      if (key.indexOf('@media') !== 0) {
        styleWithoutMedia[key] = newStyle[key];
      }
      return styleWithoutMedia;
    },
    {}
  );

  return {
    componentFields: newComponentFields,
    globalState: {mediaQueryListByQueryString},
    style: newStyle
  };
};

module.exports = resolveMediaQueries;
