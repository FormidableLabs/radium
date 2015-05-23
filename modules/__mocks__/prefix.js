'use strict';

var prefixMock = function (style) {
  return style;
};

prefixMock.css = '-webkit-';

module.exports = prefixMock;
