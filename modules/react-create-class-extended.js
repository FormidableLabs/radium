var React = require('react');
var merge = require('lodash.merge');

var Radium = require('./index');
var { StyleResolverMixin, BrowserStateMixin } = Radium;


// Arbitrary name that could be moved to config.
// Worth standardizing going forward.
var RADIUM_STYLE_NAME = "radiumStyles";

function getRadiumProps (radiumStyles) {
  var styles ={};

  if (typeof radiumStyles === "function") {
    radiumStyles = radiumStyles.call(this);
  }

  // TODO: handle array case
  if (typeof radiumStyles === "object") {
    // Resolve styles to styles
    // TODO: add computedStyleFunction
    merge(styles, StyleResolverMixin.buildStyles.call(this, radiumStyles));

    return {style: styles};
  } else {
    // Not a function or an object.
    // Can't use so throw error
  }
}

var originalCreateClass = React.createClass;
React.createClass = function(component) {
  var componentStyles = component && component[RADIUM_STYLE_NAME];
  var originalRender = component.render;

  if (componentStyles) {
    component.render = function (...args) {
      var renderedComponent = originalRender.apply(this, args);
      var radiumProps = getRadiumProps.call(this, this[RADIUM_STYLE_NAME]);

      // TODO: add logic for specific states in radiumStyles
      // Might belong in browser-state
      var radiumStateHandlers = BrowserStateMixin.getBrowserStateEvents.call(this);

      merge(renderedComponent.props, radiumProps, radiumStateHandlers);

      // TODO: handle refs, children, etc.

      return renderedComponent;
    }
  }

  return originalCreateClass.call(this, component);
};