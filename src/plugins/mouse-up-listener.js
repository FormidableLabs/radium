/* @flow */

import MobileDetect from 'mobile-detect';

const isMobile = !!(new MobileDetect(window.navigator.userAgent)).mobile();

const _callbacks = [];
let _mouseUpListenerIsActive = false;

function _handleMouseUp() {
  _callbacks.forEach(callback => {
    callback();
  });
}

const subscribe = function(callback: () => void): {remove: () => void} {
  if (_callbacks.indexOf(callback) === -1) {
    _callbacks.push(callback);
  }

  if (!_mouseUpListenerIsActive) {
    // On mobile listen to touch end instead of mouse up.
    window.addEventListener(isMobile ? 'touchend' : 'mouseup', _handleMouseUp);
    _mouseUpListenerIsActive = true;
  }

  return {
    remove: function() {
      const index = _callbacks.indexOf(callback);
      _callbacks.splice(index, 1);

      if (_callbacks.length === 0 && _mouseUpListenerIsActive) {
        window.removeEventListener(isMobile ? 'touchend' : 'mouseup', _handleMouseUp);
        _mouseUpListenerIsActive = false;
      }
    }
  };
};

export default {
  useTouchEvents: isMobile,
  subscribe: subscribe,
  __triggerForTests: _handleMouseUp
};
