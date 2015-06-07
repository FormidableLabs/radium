/* @flow */

'use strict';

var MouseUpListener = require('./mouse-up-listener');
var getState = require('./get-state');
var Prefixer = require('./prefixer');

var ExecutionEnvironment = require('exenv');
var React = require('react');
var objectAssign = require('object-assign');

// babel-eslint 3.1.7 fails here for some reason, error:
//   0:0  error  Cannot call method 'isSequenceExpression' of undefined
//
// declare class RadiumComponent extends ReactComponent {
//   _lastMouseDown: number,
//   _radiumMediaQueryListenersByQuery: Object<string, {remove: () => void}>,
//   _radiumMouseUpListener: {remove: () => void},
// }

var mediaQueryListByQueryString = {};

var _isSpecialKey = function (key) {
  return key[0] === ':' || key[0] === '@';
};

var _getStyleState = function (component, key, value) {
  return getState(component.state, key, value);
};

var _setStyleState = function (component, key, newState) {
  var existing = component.state && component.state._radiumStyleState || {};
  var state = { _radiumStyleState: objectAssign({}, existing) };
  state._radiumStyleState[key] = state._radiumStyleState[key] || {};
  objectAssign(state._radiumStyleState[key], newState);
  component.setState(state);
};

// Merge style objects. Special casing for props starting with ';'; the values
// should be objects, and are merged with others of the same name (instead of
// overwriting).
var _mergeStyles = function (styles) {
  var result = {};

  styles.forEach(function (style) {
    if (!style || typeof style !== 'object' || Array.isArray(style)) {
      return;
    }

    Object.keys(style).forEach(function (key) {
      if (_isSpecialKey(key) && result[key]) {
        result[key] = _mergeStyles([result[key], style[key]]);
      } else {
        result[key] = style[key];
      }
    });
  });

  return result;
};

var _mouseUp = function (component) {
  Object.keys(component.state._radiumStyleState).forEach(function (key) {
    if (_getStyleState(component, key, ':active')) {
      _setStyleState(component, key, {':active': false});
    }
  });
};

var _onMediaQueryChange = function (component, query, mediaQueryList) {
  var state = {};
  state[query] = mediaQueryList.matches;
  _setStyleState(component, '_all', state);
};

var _resolveMediaQueryStyles = function (component, style) {
  if (
    !ExecutionEnvironment.canUseDOM ||
    !window ||
    !window.matchMedia
  ) {
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
var resolveStyles = function (
  component: any, // ReactComponent, flow+eslint complaining
  renderedElement: any, // ReactElement
  existingKeyMap?: Object<string, string>
): any { // ReactElement
  existingKeyMap = existingKeyMap || {};

  if (!renderedElement) {
    return renderedElement;
  }

  // Recurse over children first in case we bail early. Note that children only
  // include those rendered in `this` component. Child nodes in other components
  // will not be here, so each component needs to use Radium.
  var newChildren = null;
  var oldChildren = renderedElement.props.children;
  if (oldChildren) {
    var childrenType = typeof oldChildren;
    if (childrenType === 'string' || childrenType === 'number') {
      // Don't do anything with a single primitive child
      newChildren = oldChildren;
    } else if (React.Children.count(oldChildren) === 1 && oldChildren.type) {
      // If a React Element is an only child, don't wrap it in an array for
      // React.Children.map() for React.Children.only() compatibility.
      var onlyChild = React.Children.only(oldChildren);
      newChildren = resolveStyles(component, onlyChild, existingKeyMap);
    } else {
      newChildren = React.Children.map(
        oldChildren,
        function (child) {
          if (React.isValidElement(child)) {
            return resolveStyles(component, child, existingKeyMap);
          }

          return child;
        }
      );
    }
  }

  var props = renderedElement.props;
  var style = props.style;
  var newProps = {};

  // Convenient syntax for multiple styles: `style={[style1, style2, etc]}`
  // Ignores non-objects, so you can do `this.state.isCool && styles.cool`.
  if (Array.isArray(style)) {
    style = _mergeStyles(style);
  }

  // Bail early if no interactive styles.
  if (
    !style ||
    !Object.keys(style).some(_isSpecialKey)
  ) {
    if (style) {
      // Still perform vendor prefixing, though.
      newProps.style = Prefixer.getPrefixedStyle(style);
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

  var newStyle = {};
  Object.keys(style).forEach(function (styleKey) {
    if (!_isSpecialKey(styleKey)) {
      newStyle[styleKey] = style[styleKey];
    }
  });

  // Only add handlers if necessary
  if (style[':hover'] || style[':active']) {
    // Always call the existing handler if one is already defined.
    // This code, and the very similar ones below, could be abstracted a bit
    // more, but it hurts readability IMO.
    var existingOnMouseEnter = props.onMouseEnter;
    newProps.onMouseEnter = function (e) {
      existingOnMouseEnter && existingOnMouseEnter(e);
      _setStyleState(component, key, {':hover': true});
    };

    var existingOnMouseLeave = props.onMouseLeave;
    newProps.onMouseLeave = function (e) {
      existingOnMouseLeave && existingOnMouseLeave(e);
      _setStyleState(component, key, {':hover': false});
    };
  }

  if (style[':active']) {
    var existingOnMouseDown = props.onMouseDown;
    newProps.onMouseDown = function (e) {
      existingOnMouseDown && existingOnMouseDown(e);
      component._lastMouseDown = Date.now();
      _setStyleState(component, key, {':active': true});
    };
  }

  if (style[':focus']) {
    var existingOnFocus = props.onFocus;
    newProps.onFocus = function (e) {
      existingOnFocus && existingOnFocus(e);
      _setStyleState(component, key, {':focus': true});
    };

    var existingOnBlur = props.onBlur;
    newProps.onBlur = function (e) {
      existingOnBlur && existingOnBlur(e);
      _setStyleState(component, key, {':focus': false});
    };
  }

  // Merge the styles in the order they were defined
  var interactionStyles = Object.keys(style)
    .filter(function (name) {
      return (
        (name === ':active' && _getStyleState(component, key, ':active')) ||
        (name === ':hover' && _getStyleState(component, key, ':hover')) ||
        (name === ':focus' && _getStyleState(component, key, ':focus'))
      );
    })
    .map(function (name) { return style[name]; });

  if (interactionStyles.length) {
    newStyle = _mergeStyles([newStyle].concat(interactionStyles));
  }

  if (
    style[':active'] &&
    !component._radiumMouseUpListener &&
    ExecutionEnvironment.canUseEventListeners
  ) {
    component._radiumMouseUpListener = MouseUpListener.subscribe(
      _mouseUp.bind(null, component)
    );
  }

  newProps.style = Prefixer.getPrefixedStyle(newStyle);

  return React.cloneElement(renderedElement, newProps, newChildren);
};

// Exposing methods for tests is ugly, but the alternative, re-requiring the
// module each time, is too slow
resolveStyles.__clearStateForTests = function () {
  mediaQueryListByQueryString = {};
};

module.exports = resolveStyles;
