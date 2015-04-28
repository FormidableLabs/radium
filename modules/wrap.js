'use strict';

var merge = require('lodash/object/merge');
var resolveStyles = require('./resolve-styles.js');

var wrap = function (config) {
  var newConfig = {
    getInitialState: function () {
      var existingInitialState = config.getInitialState ?
        config.getInitialState.call(this) :
        {};
      return merge({}, existingInitialState, { _radiumStyleState: {} });
    },

    componentWillUnmount: function () {
      config.componentWillUnmount && config.componentWillUnmount.call(this);

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
    },

    render: function () {
      var renderedElement = config.render.call(this);
      return resolveStyles(this, renderedElement);
    }
  };

  return merge({}, config, newConfig);
};

module.exports = wrap;
