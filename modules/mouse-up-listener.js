/* @flow */

var _callbacks = [];
var _mouseUpListenerIsActive = false;

var _handleMouseUp = function (ev) {
  _callbacks.forEach(function (callback) {
    callback(ev);
  });
};

var subscribe = function (callback: () => void): {remove: () => void} {
  if (_callbacks.indexOf(callback) === -1) {
    _callbacks.push(callback);
  }

  if (!_mouseUpListenerIsActive) {
    window.addEventListener('mouseup', _handleMouseUp);
    _mouseUpListenerIsActive = true;
  }

  return {
    remove: function () {
      var index = _callbacks.indexOf(callback);
      _callbacks.splice(index, 1);

      if (_callbacks.length === 0 && _mouseUpListenerIsActive) {
        window.removeEventListener('mouseup', _handleMouseUp);
        _mouseUpListenerIsActive = false;
      }
    }
  };
};

module.exports = {
  subscribe: subscribe
};
