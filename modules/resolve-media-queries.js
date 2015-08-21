var mergeStyles = require('./merge-styles');
var resolveMediaQueries = require('./resolve-media-queries');
var setStyleState = require('./set-style-state');

var ExecutionEnvironment = require('exenv');

var _matchMedia = ExecutionEnvironment.canUseDOM &&
  window &&
  window.matchMedia &&
  (mediaQueryString => window.matchMedia(mediaQueryString));

var mediaQueryListByQueryString = {};

var _onMediaQueryChange = function (component, query, mediaQueryList) {
  var state = {};
  state[query] = mediaQueryList.matches;
  setStyleState(component, '_all', state);
};

var resolveMediaQueries = function (component, style, config) {
  var matchMedia = config.matchMedia || _matchMedia;
  if (!matchMedia) {
    return style;
  }

  Object.keys(style)
  .filter(function (name) { return name[0] === '@'; })
  .map(function (query) {
    var mediaQueryStyles = style[query];
    query = query.replace('@media ', '');

    // Create a global MediaQueryList if one doesn't already exist
    var mql = mediaQueryListByQueryString[query];
    if (!mql) {
      mediaQueryListByQueryString[query] = mql = matchMedia(query);
    }

    // Keep track of which keys already have listeners
    if (!component._radiumMediaQueryListenersByQuery) {
      component._radiumMediaQueryListenersByQuery = {};
    }

    if (!component._radiumMediaQueryListenersByQuery[query]) {
      var listener = _onMediaQueryChange.bind(null, component, query);
      mql.addListener(listener);
      component._radiumMediaQueryListenersByQuery[query] = {
        remove: function () { console.log('mql', mql);mql.removeListener(listener); }
      };
    }

    // Apply media query states
    if (mql.matches) {
      style = mergeStyles([style, mediaQueryStyles]);
    }
  });

  return style;
};

// Exposing methods for tests is ugly, but the alternative, re-requiring the
// module each time, is too slow
resolveMediaQueries.__clearStateForTests = function () {
  mediaQueryListByQueryString = {};
};

module.exports = resolveMediaQueries;
