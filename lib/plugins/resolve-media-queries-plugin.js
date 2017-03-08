'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = resolveMediaQueries;
var _windowMatchMedia = void 0;
function _getWindowMatchMedia(ExecutionEnvironment) {
  if (_windowMatchMedia === undefined) {
    _windowMatchMedia = !!ExecutionEnvironment.canUseDOM && !!window && !!window.matchMedia && function (mediaQueryString) {
      return window.matchMedia(mediaQueryString);
    } || null;
  }
  return _windowMatchMedia;
}

function _filterObject(obj, predicate) {
  return Object.keys(obj).filter(function (key) {
    return predicate(obj[key], key);
  }).reduce(function (result, key) {
    result[key] = obj[key];
    return result;
  }, {});
}

function _removeMediaQueries(style) {
  return Object.keys(style).reduce(function (styleWithoutMedia, key) {
    if (key.indexOf('@media') !== 0) {
      styleWithoutMedia[key] = style[key];
    }
    return styleWithoutMedia;
  }, {});
}

function _toCss(query, ruleCSS, mediaQueryClassName, forceMobile) {
  if (forceMobile) {
    return '.' + mediaQueryClassName + ruleCSS;
  }
  return query + '{ .' + mediaQueryClassName + ruleCSS + '}';
}

function _topLevelRulesToCSS(_ref) {
  var addCSS = _ref.addCSS,
      appendImportantToEachValue = _ref.appendImportantToEachValue,
      cssRuleSetToString = _ref.cssRuleSetToString,
      hash = _ref.hash,
      isNestedStyle = _ref.isNestedStyle,
      style = _ref.style,
      userAgent = _ref.userAgent,
      props = _ref.props;

  var className = '';
  Object.keys(style).filter(function (name) {
    return name.indexOf('@media') === 0;
  }).map(function (query) {
    var topLevelRules = appendImportantToEachValue(_filterObject(style[query], function (value) {
      return !isNestedStyle(value);
    }));

    if (!Object.keys(topLevelRules).length) {
      return;
    }

    var ruleCSS = cssRuleSetToString('', topLevelRules, userAgent);

    // CSS classes cannot start with a number
    var mediaQueryClassName = 'rmq-' + hash(query + ruleCSS);
    var css = _toCss(query, ruleCSS, mediaQueryClassName, props.forceMobile);

    addCSS(css);

    className += (className ? ' ' : '') + mediaQueryClassName;
  });
  return className;
}

function _subscribeToMediaQuery(_ref2) {
  var listener = _ref2.listener,
      listenersByQuery = _ref2.listenersByQuery,
      matchMedia = _ref2.matchMedia,
      mediaQueryListsByQuery = _ref2.mediaQueryListsByQuery,
      query = _ref2.query;

  query = query.replace('@media ', '');

  var mql = mediaQueryListsByQuery[query];
  if (!mql && matchMedia) {
    mediaQueryListsByQuery[query] = mql = matchMedia(query);
  }

  if (!listenersByQuery || !listenersByQuery[query]) {
    mql.addListener(listener);

    listenersByQuery[query] = {
      remove: function remove() {
        mql.removeListener(listener);
      }
    };
  }
  return mql;
}

function resolveMediaQueries(_ref3) {
  var ExecutionEnvironment = _ref3.ExecutionEnvironment,
      addCSS = _ref3.addCSS,
      appendImportantToEachValue = _ref3.appendImportantToEachValue,
      config = _ref3.config,
      cssRuleSetToString = _ref3.cssRuleSetToString,
      getComponentField = _ref3.getComponentField,
      getGlobalState = _ref3.getGlobalState,
      hash = _ref3.hash,
      isNestedStyle = _ref3.isNestedStyle,
      mergeStyles = _ref3.mergeStyles,
      props = _ref3.props,
      setState = _ref3.setState,
      style = _ref3.style;
  // eslint-disable-line no-shadow
  var newStyle = _removeMediaQueries(style);
  var mediaQueryClassNames = _topLevelRulesToCSS({
    addCSS: addCSS,
    appendImportantToEachValue: appendImportantToEachValue,
    cssRuleSetToString: cssRuleSetToString,
    hash: hash,
    isNestedStyle: isNestedStyle,
    style: style,
    userAgent: config.userAgent,
    props: props
  });

  var newProps = mediaQueryClassNames ? {
    className: mediaQueryClassNames + (props.className ? ' ' + props.className : '')
  } : null;

  var matchMedia = config.matchMedia || _getWindowMatchMedia(ExecutionEnvironment);

  if (!matchMedia) {
    return {
      props: newProps,
      style: newStyle
    };
  }

  var listenersByQuery = _extends({}, getComponentField('_radiumMediaQueryListenersByQuery'));
  var mediaQueryListsByQuery = getGlobalState('mediaQueryListsByQuery') || {};

  Object.keys(style).filter(function (name) {
    return name.indexOf('@media') === 0;
  }).map(function (query) {
    var nestedRules = _filterObject(style[query], isNestedStyle);

    if (!Object.keys(nestedRules).length) {
      return;
    }

    var mql = _subscribeToMediaQuery({
      listener: function listener() {
        return setState(query, mql.matches, '_all');
      },
      listenersByQuery: listenersByQuery,
      matchMedia: matchMedia,
      mediaQueryListsByQuery: mediaQueryListsByQuery,
      query: query
    });

    // Apply media query states
    if (mql.matches) {
      newStyle = mergeStyles([newStyle, nestedRules]);
    }
  });

  return {
    componentFields: {
      _radiumMediaQueryListenersByQuery: listenersByQuery
    },
    globalState: { mediaQueryListsByQuery: mediaQueryListsByQuery },
    props: newProps,
    style: newStyle
  };
}
module.exports = exports['default'];