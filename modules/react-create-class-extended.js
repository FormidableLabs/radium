var React = require('react');
var findWhere = require('lodash.findWhere');
var forEach = require('lodash.foreach');
var isArray = require('lodash.isarray');
var merge = require('lodash.merge');

var Radium = require('./index');
var { StyleResolverMixin, BrowserStateMixin } = Radium;


// Arbitrary name that could be moved to config.
// Worth standardizing going forward.
var RADIUM_STYLE_NAME = "radiumStyles";

function getRadiumProps (radiumStyles) {
  var styles = {};
  var browserStates;

  if (typeof radiumStyles === "function") {
    radiumStyles = radiumStyles.call(this);
  }

  // TODO: handle array case
  if (typeof radiumStyles === "object") {
    // Resolve styles to styles
    // TODO: add computedStyleFunction
    merge(styles, StyleResolverMixin.buildStyles.call(this, radiumStyles));

    // If the current context is a rendered element, in the case of refs
    // ignore browser state because there isn't a way to attach handlers with the appropriate context
    // yet
    browserStates = this._currentElement && BrowserStateMixin.getBrowserStateEvents.call(this, styles);

    return {
      style: styles,
      refs: radiumStyles.refs,
      stateHandlers: browserStates
    };
  } else {
    // Not a function or an object.
    // Can't use so throw error
    throw new Error(RADIUM_STYLE_NAME + " must be a function or an object");
  }
}

function addRefStyles (refStyles, refName) {
  // Could be abstracted to handle any child type not just ref
  // this.props.children could be a single object or an array of child objects
  var children = this.props.children || {};
  var refComponent =  isArray(children) ?
    findWhere(this.props.children, {ref: refName}) :
    children.ref === refName && children;

  if (refComponent) {
    refComponent = mergeRadiumIntoComponent(refComponent, getRadiumProps.call(refComponent, refStyles));
  }
}

function mergeRadiumIntoComponent(renderedComponent, radiumProps) {
  renderedComponent.props.style = renderedComponent.props.style || {};

  merge(renderedComponent.props.style, radiumProps.style);
  merge(renderedComponent.props, radiumProps.stateHandlers);

  if (radiumProps.refs) {
    forEach(radiumProps.refs, addRefStyles.bind(renderedComponent));
  }

  return renderedComponent;
}

var originalCreateClass = React.createClass;
React.createClass = function(component) {
  var componentStyles = component && component[RADIUM_STYLE_NAME];
  var originalRender = component.render;

  if (componentStyles) {
    component.render = function (...args) {
      var renderedComponent = originalRender.apply(this, args);
      var radiumProps = getRadiumProps.call(this, this[RADIUM_STYLE_NAME]);

      renderedComponent = mergeRadiumIntoComponent(renderedComponent, radiumProps);

      return renderedComponent;
    }
  }

  return originalCreateClass.call(this, component);
};