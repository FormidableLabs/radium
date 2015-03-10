var _callbacks = [];
var _mouseUpListenerIsActive = false;

var _includes = function (arr, item) {
  return arr.indexOf(item) !== -1;
};

var _handleMouseUp = function (ev) {
  _callbacks.forEach(function (callback) {
    callback(ev);
  });
};

var subscribe = function (callback) {
  if (!_includes(_callbacks, callback)) {
    _callbacks.push(callback);
  }

  if (_callbacks.length > 0 && !_mouseUpListenerIsActive) {
    window.addEventListener("mouseup", _handleMouseUp);
    _mouseUpListenerIsActive = true;
  }

  return {
    remove: function () {
      var index = _callbacks.indexOf(callback);
      _callbacks.splice(index, 1);

      if (_callbacks.length === 0 && _mouseUpListenerIsActive) {
        window.removeEventListener("mouseup", _handleMouseUp);
        _mouseUpListenerIsActive = false;
      }
    }
  }
};

module.exports = {
  subscribe: subscribe
};
