/* @flow */

var Prefixer = require('./prefixer');
var checkProps = require('./check-props');
var getState = require('./get-state');
var getStateKey = require('./get-state-key');
var mergeStyles = require('./merge-styles');
var resolveInteractionStyles = require('./resolve-interaction-styles');
var resolveMediaQueries = require('./resolve-media-queries');

var ExecutionEnvironment = require('exenv');
var React = require('react');

var _setStyleState = function (component, key, stateKey, value) {
  var existing = component._lastRadiumState ||
    component.state && component.state._radiumStyleState || {};

  var state = { _radiumStyleState: {...existing} };
  state._radiumStyleState[key] = {...state._radiumStyleState[key]};
  state._radiumStyleState[key][stateKey] = value;

  component._lastRadiumState = state._radiumStyleState;
  component.setState(state);
};

// Wrapper around React.cloneElement. To avoid processing the same element
// twice, whenever we clone an element add a special non-enumerable prop to
// make sure we don't process this element again.
var _cloneElement = function (renderedElement, newProps, newChildren) {
  // Only add flag if this is a normal DOM element
  if (typeof renderedElement.type === 'string') {
    newProps = {...newProps, _radiumDidResolveStyles: true};
  }

  return React.cloneElement(renderedElement, newProps, newChildren);
};

var _buildGetKey = function (renderedElement, existingKeyMap) {
  // We need a unique key to correlate state changes due to user interaction
  // with the rendered element, so we know to apply the proper interactive
  // styles.
  var originalKey = renderedElement.ref || renderedElement.key;
  var key = getStateKey(originalKey);

  var alreadyGotKey = false;
  var getKey = function () {
    if (alreadyGotKey) {
      return key;
    }

    alreadyGotKey = true;

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

    return key;
  };

  return getKey;
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
  config: Object = {},
  existingKeyMap?: {[key: string]: boolean}
): any { // ReactElement
  existingKeyMap = existingKeyMap || {};

  if (
    !renderedElement ||
    // Bail if we've already processed this element. This ensures that only the
    // owner of an element processes that element, since the owner's render
    // function will be called first (which will always be the case, since you
    // can't know what else to render until you render the parent component).
    (renderedElement.props && renderedElement.props._radiumDidResolveStyles)
  ) {
    return renderedElement;
  }

  // Recurse over children first in case we bail early. Note that children only
  // include those rendered in `this` component. Child nodes in other components
  // will not be here, so each component needs to use Radium.
  var oldChildren = renderedElement.props.children;
  var newChildren = oldChildren;
  if (oldChildren) {
    var childrenType = typeof oldChildren;
    if (childrenType === 'string' || childrenType === 'number') {
      // Don't do anything with a single primitive child
      newChildren = oldChildren;
    } else if (childrenType === 'function') {
      // Wrap the function, resolving styles on the result
      newChildren = function () {
        var result = oldChildren.apply(this, arguments);
        if (React.isValidElement(result)) {
          return resolveStyles(component, result, config, existingKeyMap);
        }
        return result;
      };
    } else if (React.Children.count(oldChildren) === 1 && oldChildren.type) {
      // If a React Element is an only child, don't wrap it in an array for
      // React.Children.map() for React.Children.only() compatibility.
      var onlyChild = React.Children.only(oldChildren);
      newChildren = resolveStyles(component, onlyChild, config, existingKeyMap);
    } else {
      newChildren = React.Children.map(
        oldChildren,
        function (child) {
          if (React.isValidElement(child)) {
            return resolveStyles(component, child, config, existingKeyMap);
          }

          return child;
        }
      );
    }
  }

  var props = renderedElement.props;
  var newProps = props;

  // Recurse over props, just like children
  Object.keys(props).forEach(prop => {
    // We already recurse over children above
    if (prop === 'children') {
      return;
    }

    var propValue = props[prop];
    if (React.isValidElement(propValue)) {
      newProps = {...newProps};
      newProps[prop] = resolveStyles(
        component,
        propValue,
        config,
        existingKeyMap
      );
    }
  });

  // Bail early if element is not a simple ReactDOMElement or has no style
  if (
    !React.isValidElement(renderedElement) ||
    typeof renderedElement.type !== 'string' ||
    !props.style
  ) {
    if (oldChildren === newChildren && newProps === renderedElement.props) {
      return renderedElement;
    }

    return _cloneElement(
      renderedElement,
      newProps !== renderedElement.props ? newProps : {},
      newChildren
    );
  }

  var checkPropsPlugin = function ({component, style}) {
    checkProps(component, style);
    return {style};
  };

  // Convenient syntax for multiple styles: `style={[style1, style2, etc]}`
  // Ignores non-objects, so you can do `this.state.isCool && styles.cool`.
  var mergeArray = function ({style, mergeStyles}) {
    var newStyle = Array.isArray(style) ? mergeStyles(style) : style;
    return {style: newStyle};
  };

  var prefix = function ({component, style}) {
    var newStyle = Prefixer.getPrefixedStyle(component, style);
    return {style: newStyle};
  };

  var plugins = [
    mergeArray,
    checkPropsPlugin,
    resolveMediaQueries,
    resolveInteractionStyles,
    prefix,
    checkPropsPlugin,
  ];

  var getKey = _buildGetKey(renderedElement, existingKeyMap);
  var currentStyle = props.style;
  plugins.forEach(plugin => {
    var result = plugin({
      ExecutionEnvironment,
      component,
      config,
      getState: stateKey => getState(component.state, getKey(), stateKey),
      mergeStyles,
      props,
      setState: (stateKey, value, elementKey) =>
        _setStyleState(component, elementKey || getKey(), stateKey, value),
      style: currentStyle
    });

    currentStyle = result.style;

    newProps = result.props && Object.keys(result.props).length ?
      {...newProps, ...result.props} :
      newProps;

    if (result.componentFields) {
      Object.keys(result.componentFields).forEach(newComponentFieldName => {
        component[newComponentFieldName] =
          result.componentFields[newComponentFieldName];
      });
    }
  });

  if (currentStyle !== props.style) {
    newProps = {...newProps, style: currentStyle};
  }

  return _cloneElement(renderedElement, newProps, newChildren);
};

module.exports = resolveStyles;
