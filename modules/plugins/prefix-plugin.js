/* @flow */

var Prefixer = require('../prefixer');

var prefixPlugin = function ({component, style}) {
  var newStyle = Prefixer.getPrefixedStyle(component, style);
  return {style: newStyle};
};

module.exports = prefixPlugin;
