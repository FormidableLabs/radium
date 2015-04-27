'use strict';

var MouseUpListener = require('./mouse-up-listener');
var React = require('react/addons');
var clone = require('lodash/lang/clone');
var isArray = require('lodash/lang/isArray');
var merge = require('lodash/object/merge');
var omit = require('lodash/object/omit');

var mediaQueryListByQueryString = {};

var _isSpecialKey = function (key) {
  return key[0] === ':' || key[0] === '@';
};

var _getStyleState = function (component, key, value) {
  return component.state &&
    component.state._radiumStyleState &&
      component.state._radiumStyleState[key] &&
        component.state._radiumStyleState[key][value];
};

var _setStyleState = function (component, key, newState) {
  var existing = component.state && component.state._radiumStyleState || {};
  var state = { _radiumStyleState: clone(existing) };
  state._radiumStyleState[key] = state._radiumStyleState[key] || {};
  merge(state._radiumStyleState[key], newState);
  component.setState(state);
};

// Merge style objects. Special casing for props starting with ';'; the values
// should be objects, and are merged with others of the same name (instead of
// overwriting).
var _mergeStyles = function (styles) {
  var validStyles = styles.filter(function (style) {
    return style && typeof style === 'object' && !isArray(style);
  });

  // lodash merge is recursive, which handles :hover styles and even :hover
  // within media queries.
  return merge.apply(null, [{}].concat(validStyles));
};

var _mouseUp = function (component) {
  Object.keys(component.state._radiumStyleState).forEach(function (key) {
    if (_getStyleState(component, key, 'isActive')) {
      _setStyleState(component, key, {isActive: false});
    }
  });
};

var _onMediaQueryChange = function (component, query, mediaQueryList) {
  var state = {};
  state[name] = mediaQueryList.matches;
  _setStyleState(component, '_all', state);
};

var _resolveMediaQueryStyles = function (component, style) {
  Object.keys(style)
  .filter(function (name) { return name[0] === '@'; })
  .map(function (query) {
    var mediaQueryStyles = style[query];
    query = query.replace('@media ', '');

    // Create a global MediaQueryList if one doesn't already exist
    var mql = mediaQueryListByQueryString[query];
    if (!mql) {
      mediaQueryListByQueryString[query] = mql = window.matchMedia(query);
    }

    // Keep track of which keys already have listeners
    if (!component._radiumMediaQueryListenersByQuery) {
      component._radiumMediaQueryListenersByQuery = {};
    }

    if (!component._radiumMediaQueryListenersByQuery[query]) {
      var listener = _onMediaQueryChange.bind(null, component, query);
      mql.addListener(listener);
      component._radiumMediaQueryListenersByQuery[query] = {
        remove: function () { mql.removeListener(listener); }
      };
    }

    // Apply media query states
    if (mql.matches) {
      style = _mergeStyles([style, mediaQueryStyles]);
    }
  });

  return style;
};

//
// The nucleus of Radium. resolveStyles is called on the rendered elements
// before they are returned in render. It iterates over the elements and
// children, rewriting props to add event handlers required to capture user
// interactions (e.g. mouse over). It also replaces the style prop because it
// adds in the various interaction styles (e.g. :hover).
//
var resolveStyles = function (component, renderedElement, existingKeyMap) {
  existingKeyMap = existingKeyMap || {};

  if (!renderedElement) {
    return renderedElement;
  }

  // Recurse over children first in case we bail early. Could be optimized to be
  // iterative if needed. Note that children only include those rendered in
  // `this` component. Child nodes in other components will not be here, so each
  // component needs to use Radium.wrap.
  var newChildren = null;
  if (renderedElement.props.children) {
    newChildren = React.Children.map(
      renderedElement.props.children,
      function (child) {
        if (React.isValidElement(child)) {
          return resolveStyles(component, child, existingKeyMap);
        }
        return child;
      }
    );
  }

  var props = renderedElement.props;
  var style = props.style;
  var newProps = {};

  // Convenient syntax for multiple styles: `style={[style1, style2, etc]}`
  // Ignores non-objects, so you can do `this.state.isCool && styles.cool`.
  if (isArray(style)) {
    style = _mergeStyles(style);
  }

  // Bail early if no interactive styles.
  if (
    !style ||
    !Object.keys(style).some(_isSpecialKey)
  ) {
    if (style) {
      newProps.style = style;
      return React.cloneElement(renderedElement, newProps, newChildren);
    } else if (newChildren) {
      return React.cloneElement(renderedElement, {}, newChildren);
    }

    return renderedElement;
  }

  // We need a unique key to correlate state changes due to user interaction
  // with the rendered element, so we know to apply the proper interactive
  // styles.
  var originalKey = renderedElement.ref || renderedElement.key;
  var key = originalKey || 'main';

  if (existingKeyMap[key]) {
    throw new Error(
      'Radium requires each element with interactive styles to have a unique ' +
      'key, set using either the ref or key prop. ' +
      (originalKey ?
        'Key "' + originalKey + '" is a duplicate.' :
        'Multiple elements have no key specified.')
    );
  }

  existingKeyMap[key] = true;

  // Media queries can contain pseudo styles, like :hover
  style = _resolveMediaQueryStyles(component, style);

  var newStyle = omit(
    style,
    function (value, styleKey) { return _isSpecialKey(styleKey); }
  );

  // Only add handlers if necessary
  if (style[':hover'] || style[':active']) {
    // Always call the existing handler if one is already defined.
    // This code, and the very similar ones below, could be abstracted a bit
    // more, but it hurts readability IMO.
    var existingOnMouseEnter = props.onMouseEnter;
    newProps.onMouseEnter = function (e) {
      existingOnMouseEnter && existingOnMouseEnter(e);
      _setStyleState(component, key, { isHovering: true });
    };

    var existingOnMouseLeave = props.onMouseLeave;
    newProps.onMouseLeave = function (e) {
      existingOnMouseLeave && existingOnMouseLeave(e);
      _setStyleState(component, key, { isHovering: false });
    };
  }

  if (style[':active']) {
    var existingOnMouseDown = props.onMouseDown;
    newProps.onMouseDown = function (e) {
      existingOnMouseDown && existingOnMouseDown(e);
      component._lastMouseDown = Date.now();
      _setStyleState(component, key, { isActive: true });
    };
  }

  if (style[':focus']) {
    var existingOnFocus = props.onFocus;
    newProps.onFocus = function (e) {
      existingOnFocus && existingOnFocus(e);
      _setStyleState(component, key, { isFocused: true });
    };

    var existingOnBlur = props.onBlur;
    newProps.onBlur = function (e) {
      existingOnBlur && existingOnBlur(e);
      _setStyleState(component, key, { isFocused: false });
    };
  }

  // Merge the styles in the order they were defined
  Object.keys(style).forEach(function (name) {
    if (
      (name === ':active' && _getStyleState(component, key, 'isActive')) ||
      (name === ':hover' && _getStyleState(component, key, 'isHovering')) ||
      (name === ':focus' && _getStyleState(component, key, 'isFocused'))
    ) {
      merge(newStyle, style[name]);
    }
  });

  if (style[':active'] && !component._radiumMouseUpListener) {
    component._radiumMouseUpListener = MouseUpListener.subscribe(
      _mouseUp.bind(null, component)
    );
  }

  newProps.style = newStyle;

  return React.cloneElement(renderedElement, newProps, newChildren);
};

// Exposing methods for tests is ugly, but the alternative, re-requiring the
// module each time, is too slow
resolveStyles.__clearStateForTests = function () {
  mediaQueryListByQueryString = {};
};

module.exports = resolveStyles;
