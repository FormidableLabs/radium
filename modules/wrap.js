'use strict';

var resolveStyles = require('./resolve-styles.js');
var wrapUtils = require('./wrap-utils.js');

var merge = require('lodash/object/merge');

var wrap = function (config) {
  var newConfig = {
    getInitialState: function () {
      var existingInitialState = config.getInitialState ?
        config.getInitialState.call(this) :
        {};
      var radiumInitialState = wrapUtils.getInitialState();
      return merge({}, existingInitialState, radiumInitialState);
    },

    componentWillUnmount: function () {
      config.componentWillUnmount && config.componentWillUnmount.call(this);
      wrapUtils.componentWillUnmount(this);
    },

    render: function () {
      var renderedElement = config.render.call(this);
      return resolveStyles(this, renderedElement);
    }
  };

  return merge({}, config, newConfig);
};

module.exports = wrap;
