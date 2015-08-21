var _windowMatchMedia;
var _getWindowMatchMedia = function (ExecutionEnvironment) {
  if (_windowMatchMedia === undefined) {
    _windowMatchMedia = !!ExecutionEnvironment.canUseDOM &&
      !!window &&
      !!window.matchMedia &&
      (mediaQueryString => window.matchMedia(mediaQueryString));
  }
  return _windowMatchMedia;
};

var mediaQueryListByQueryString = {};

var resolveMediaQueries = function ({
  ExecutionEnvironment,
  component,
  config,
  mergeStyles,
  setState,
  style
}) {
  var newComponentFields = {};
  var newStyle = style;
  var matchMedia = config.matchMedia ||
    _getWindowMatchMedia(ExecutionEnvironment);
  if (!matchMedia) {
    return newStyle;
  }

  Object.keys(style)
  .filter(function (name) { return name.indexOf('@media') === 0; })
  .map(function (query) {
    var mediaQueryStyles = style[query];
    query = query.replace('@media ', '');

    // Create a global MediaQueryList if one doesn't already exist
    var mql = mediaQueryListByQueryString[query];
    if (!mql) {
      mediaQueryListByQueryString[query] = mql = matchMedia(query);
    }

    if (
      !component._radiumMediaQueryListenersByQuery ||
      !component._radiumMediaQueryListenersByQuery[query]
    ) {
      var listener = () => setState(query, mql.matches, '_all');
      mql.addListener(listener);
      newComponentFields._radiumMediaQueryListenersByQuery = {
        ...component._radiumMediaQueryListenersByQuery
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
    style: newStyle
  };
};

// Exposing methods for tests is ugly, but the alternative, re-requiring the
// module each time, is too slow
resolveMediaQueries.__clearStateForTests = function () {
  mediaQueryListByQueryString = {};
};

module.exports = resolveMediaQueries;
