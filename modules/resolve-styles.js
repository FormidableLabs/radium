'use strict';

var MouseUpListener = require('./mouse-up-listener');
var React = require('react/addons');
var clone = require('lodash/lang/clone');
var isArray = require('lodash/lang/isArray');
var merge = require('lodash/object/merge');
var omit = require('lodash/object/omit');

var mediaQueryListByQueryString = {};

//
// The nucleus of Radium. resolveStyles is called on the rendered elements
// before they are returned in render. It iterates over the elements and
// children, rewriting props to add event handlers required to capture user
// interactions (e.g. mouse over). It also replaces the style prop because it
// adds in the various interaction styles (e.g. :hover).
//
function resolveStyles(component, renderedElement, existingKeyMap) {
  existingKeyMap = existingKeyMap || {};

  // Recurse over children first in case we bail early. Could be optimized to be
  // iterative if needed. Note that children only include those rendered in
  // `this` component. Child nodes in other components will not be here, so each
  // component needs to use Radium.wrap.
  if (renderedElement.props.children) {
    React.Children.forEach(renderedElement.props.children, function (child) {
      if (React.isValidElement(child)) {
        resolveStyles(component, child, existingKeyMap);
      }
    });
  }

  var props = renderedElement.props;
  var style = props.style;

  // Convenient syntax for multiple styles: `style={[style1, style2, etc]}`
  // Ignores non-objects, so you can do `this.state.isCool && styles.cool`.
  if (isArray(style)) {
    props.style = style = _mergeStyles(style);
  }

  // Bail early if no interactive styles.
  if (
    !style ||
    !Object.keys(style).some(_isSpecialKey)
  ) {
    return renderedElement;
  }

  var newStyle = omit(style, function (value, key) { return _isSpecialKey(key); });

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

  // Media queries
  Object.keys(style).filter(name => name[0] === '(').map(function (name) {
    // Create a global MediaQueryList if one doesn't already exist
    var mql = mediaQueryListByQueryString[name];
    if (!mql) {
      mediaQueryListByQueryString[name] = mql = window.matchMedia(name);
      // mql.addListener(function() { component.forceUpdate(); });
    }

    // Keep track of which keys already have listeners
    if (!component._radiumMediaQueriesByKey) {
      component._radiumMediaQueriesByKey = {};
    }
    if (!component._radiumMediaQueriesByKey[key]) {
      component._radiumMediaQueriesByKey[key] = {};
    }

    if (!component._radiumMediaQueriesByKey[key][name]) {
      component._radiumMediaQueriesByKey[key][name] = true;
      // Make sure the state for this key is updated when the media changes
      // TODO: only add one listener per component, since we know from `styles`
      // which keys need to update.
      mql.addListener(function(mql) {
        var state = {};
        state[name] = mql.matches;
        _setStyleState(component, key, state);
      });
    }

    // Apply media query states
    if (_getStyleState(component, key, name)) {
      var mediaQueryStyles = style[name];
      merge(newStyle, mediaQueryStyles);
    }
  });

  // Only add handlers if necessary
  if (style[':hover'] || style[':active']) {
    // Always call the existing handler if one is already defined.
    // This code, and the very similar ones below, could be abstracted a bit
    // more, but it hurts readability IMO.
    var existingOnMouseEnter = props.onMouseEnter;
    props.onMouseEnter = function (e) {
      existingOnMouseEnter && existingOnMouseEnter(e);
      _setStyleState(component, key, { isHovering: true });
    };

    var existingOnMouseLeave = props.onMouseLeave;
    props.onMouseLeave = function (e) {
      existingOnMouseLeave && existingOnMouseLeave(e);
      _setStyleState(component, key, { isHovering: false });
    };

    var existingOnMouseDown = props.onMouseDown;
    props.onMouseDown = function (e) {
      existingOnMouseDown && existingOnMouseDown(e);
      component._lastMouseDown = Date.now();
      _setStyleState(component, key, { isActive: true });
    };

    // Merge in the styles if needed
    if (_getStyleState(component, key, 'isHovering')) {
      merge(newStyle, style[':hover']);
    }

    if (_getStyleState(component, key, 'isActive')) {
      merge(newStyle, style[':active']);
    }
  }

  if (style[':focus']) {
    var existingOnFocus = props.onFocus;
    props.onFocus = function (e) {
      existingOnFocus && existingOnFocus(e);
      _setStyleState(component, key, { isFocused: true });
    };

    var existingOnBlur = props.onBlur;
    props.onBlur = function (e) {
      existingOnBlur && existingOnBlur(e);
      _setStyleState(component, key, { isFocused: false });
    };

    if (_getStyleState(component, key, 'isFocused')) {
      merge(newStyle, style[':focus']);
    }
  }

  if (style[':active'] && !component._radiumMouseUpListener) {
    component._radiumMouseUpListener = MouseUpListener.subscribe(
      _mouseUp.bind(null, component)
    );
  }

  props.style = newStyle;

  return renderedElement;
}

function _isSpecialKey(key) {
  return key[0] === ':' || key[0] === '(';
}

function _getStyleState(component, key, value) {
  return component.state &&
    component.state._radiumStyleState &&
      component.state._radiumStyleState[key] &&
        component.state._radiumStyleState[key][value];
}

function _setStyleState(component, key, newState) {
  var existing = component.state && component.state._radiumStyleState || {};
  var state = { _radiumStyleState: clone(existing) };
  state._radiumStyleState[key] = state._radiumStyleState[key] || {};
  merge(state._radiumStyleState[key], newState);
  component.setState(state);
}

// Merge style objects. Special casing for props starting with ';'; the values
// should be objects, and are merged with others of the same name (instead of
// overwriting).
function _mergeStyles(styles) {
  var styleProp = {};

  styles.forEach(function (style) {
    if (!style || typeof style !== 'object') {
      return;
    }

    Object.keys(style).forEach(function (name) {
      if (_isSpecialKey(name)) {
        styleProp[name] = styleProp[name] || {};
        merge(styleProp[name], style[name]);
      } else {
        styleProp[name] = style[name];
      }
    });
  });

  return styleProp;
}

function _mouseUp(component) {
  Object.keys(component.state._radiumStyleState).forEach(function (key) {
    if (_getStyleState(component, key, 'isActive')) {
      _setStyleState(component, key, {isActive: false});
    }
  });
}

module.exports = resolveStyles;
