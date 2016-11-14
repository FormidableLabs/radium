'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = appendPxIfNeeded;


// Copied from https://github.com/facebook/react/blob/
// 102cd291899f9942a76c40a0e78920a6fe544dc1/
// src/renderers/dom/shared/CSSProperty.js
var isUnitlessNumber = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
};

function appendPxIfNeeded(propertyName, value) {
  var needsPxSuffix = !isUnitlessNumber[propertyName] && typeof value === 'number' && value !== 0;
  return needsPxSuffix ? value + 'px' : value;
}
module.exports = exports['default'];