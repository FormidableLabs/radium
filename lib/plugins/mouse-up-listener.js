'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _callbacks = [];
var _mouseUpListenerIsActive = false;

function _handleMouseUp() {
  _callbacks.forEach(function (callback) {
    callback();
  });
}

var subscribe = function subscribe(callback) {
  if (_callbacks.indexOf(callback) === -1) {
    _callbacks.push(callback);
  }

  if (!_mouseUpListenerIsActive) {
    window.addEventListener('mouseup', _handleMouseUp);
    _mouseUpListenerIsActive = true;
  }

  return {
    remove: function remove() {
      var index = _callbacks.indexOf(callback);
      _callbacks.splice(index, 1);

      if (_callbacks.length === 0 && _mouseUpListenerIsActive) {
        window.removeEventListener('mouseup', _handleMouseUp);
        _mouseUpListenerIsActive = false;
      }
    }
  };
};

exports.default = {
  subscribe: subscribe,
  __triggerForTests: _handleMouseUp
};
module.exports = exports['default'];