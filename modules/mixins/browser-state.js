// Currently not called from extendedCreateClass
var getInitialState = function () {
  return {
    hover: false,
    focus: false,
    active: false
  };
};

var getBrowserStateEvents = function () {
  return {
    onMouseEnter: handleMouseEnter.bind(this),
    onMouseLeave: handleMouseLeave.bind(this),
    onMouseDown: handleMouseDown.bind(this),
    onMouseUp: handleMouseUp.bind(this),
    onFocus: handleFocus.bind(this),
    onBlur: handleBlur.bind(this)
  };
};

var callRadiumHandler = function (handler, ev) {
  var currentHandler = this.props[handler];

  if (currentHandler) {
    currentHandler(ev);
  }
};

var handleMouseEnter = function (ev) {
  callRadiumHandler.call(this, "onMouseEnter", ev);

  this.setState({
    hover: true
  });
};

var handleMouseLeave = function (ev) {
  callRadiumHandler.call(this, "onMouseLeave", ev);

  this.setState({
    hover: false,
    active: false
  });
};

var handleMouseDown = function (ev) {
  callRadiumHandler.call(this, "onMouseDown", ev);

  this.setState({
    active: true
  });
};

var handleMouseUp = function (ev) {
  callRadiumHandler.call(this, "onMouseUp", ev);

  this.setState({
    active: false
  });
};

var handleFocus = function (ev) {
  callRadiumHandler.call(this, "onFocus", ev);

  this.setState({
    focus: true
  });
};

var handleBlur = function (ev) {
  callRadiumHandler.call(this, "onBlur", ev);

  this.setState({
    focus: false
  });
};

var BrowserStateMixin = {
  // Currently not called from extendedCreateClass
  getInitialState: getInitialState,

  getBrowserStateEvents: getBrowserStateEvents,

  callRadiumHandler: callRadiumHandler,

  handleMouseEnter: handleMouseEnter,

  handleMouseLeave: handleMouseLeave,

  handleMouseDown: handleMouseDown,

  handleMouseUp: handleMouseUp,

  handleFocus: handleFocus,

  handleBlur: handleBlur
};

module.exports = BrowserStateMixin;
