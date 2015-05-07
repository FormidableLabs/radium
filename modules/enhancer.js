var resolveStyles = require('./resolve-styles.js');
var wrapUtils = require('./wrap-utils.js');

module.exports = function enhanceWithRadium(ComposedComponent) {
  function RadiumEnhancer () {
    ComposedComponent.prototype.constructor.call(this);
    var radiumInitialState = wrapUtils.getInitialState();
    Object.keys(radiumInitialState).forEach(function (key) {
      this.state[key] = radiumInitialState[key];
    }, this);
  }

  RadiumEnhancer.prototype = new ComposedComponent();
  RadiumEnhancer.prototype.constructor = RadiumEnhancer;

  RadiumEnhancer.prototype.render = function () {
    var renderedElement = ComposedComponent.prototype.render.call(this);
    return resolveStyles(this, renderedElement);
  };

  RadiumEnhancer.prototype.componentWillUnmount = function () {
    if (ComposedComponent.prototype.componentWillUnmount) {
      ComposedComponent.prototype.componentWillUnmount.call(this);
    }

    wrapUtils.componentWillUnmount(this);
  };

  RadiumEnhancer.propTypes = ComposedComponent.propTypes;
  RadiumEnhancer.contextTypes = ComposedComponent.contextTypes;

  return RadiumEnhancer;
};
