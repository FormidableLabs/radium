/* @flow */

const _callbacks = [];
let _mouseUpListenerIsActive = false;

const _handleMouseUp = function (ev) {
  _callbacks.forEach(function (callback) {
    callback(ev);
  });
};

const subscribe = function (callback: () => void): {remove: () => void} {
  if (_callbacks.indexOf(callback) === -1) {
    _callbacks.push(callback);
  }

  if (!_mouseUpListenerIsActive) {
    window.addEventListener('mouseup', _handleMouseUp);
    _mouseUpListenerIsActive = true;
  }

  return {
    remove: function () {
      const index = _callbacks.indexOf(callback);
      _callbacks.splice(index, 1);

      if (_callbacks.length === 0 && _mouseUpListenerIsActive) {
        window.removeEventListener('mouseup', _handleMouseUp);
        _mouseUpListenerIsActive = false;
      }
    }
  };
};

export default {
  subscribe: subscribe
};
