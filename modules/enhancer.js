/* @flow */

var resolveStyles = require('./resolve-styles.js');

var enhanceWithRadium = function (ComposedComponent: constructor): constructor {
  var displayName =
    ComposedComponent.displayName ||
    ComposedComponent.name ||
    'Component';

  let { render, componentWillUnmount } = ComposedComponent.prototype;

  ComposedComponent.prototype.render = function () {
    var renderedElement = render.call(this);
    return resolveStyles(this, renderedElement);
  };

  ComposedComponent.prototype.componentWillUnmount = function () {
    if (componentWillUnmount) {
      componentWillUnmount.call(this);
    }

    if (this._radiumMouseUpListener) {
      this._radiumMouseUpListener.remove();
    }

    if (this._radiumMediaQueryListenersByQuery) {
      Object.keys(this._radiumMediaQueryListenersByQuery).forEach(
        function (query) {
          this._radiumMediaQueryListenersByQuery[query].remove();
        },
        this
      );
    }
  };

  ComposedComponent.displayName = `Radium(${displayName})`;

  return ComposedComponent;
};

module.exports = enhanceWithRadium;
