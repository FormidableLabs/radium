// Currently not called from extendedCreateClass
var getInitialState = function () {
  return {
    hover: false,
    focus: false,
    active: false
  };
};

var wrapHandler = function (userHandler, radiumHandler, context) {
  if (!userHandler || !radiumHandler || !context) {
    return;
  }

  return function () {
    radiumHandler.apply(context, arguments);
    userHandler.apply(context, arguments);
  };
};

var handleMouseEnter = function (ev) {
  this.setState({
    hover: true
  });
};

var handleMouseLeave = function (ev) {
  this.setState({
    hover: false,
    active: false
  });
};

var handleMouseDown = function (ev) {
  this.setState({
    active: true
  });
};

var handleMouseUp = function (ev) {
  this.setState({
    active: false
  });
};

var handleFocus = function (ev) {
  this.setState({
    focus: true
  });
};

var handleBlur = function (ev) {
  this.setState({
    focus: false
  });
};

var handlerMap = {
  onMouseEnter: {
    state: "hover",
    handler: handleMouseEnter
  },
  onMouseLeave: {
    state: "hover",
    handler: handleMouseLeave
  },
  onMouseDown: {
    state: "active",
    handler: handleMouseDown
  },
  onMouseUp: {
    state: "active",
    handler: handleMouseUp
  },
  onFocus: {
    state: "focus",
    handler: handleFocus
  },
  onBlur: {
    state: "focus",
    handler: handleBlur
  }
};

var getBrowserStateEvents = function (styles, userProps) {
  states = styles ? styles.states || {} : {}
  userProps = userProps || {};

  function getHandler(handlerName) {
    var handlerObj = handlerMap[handlerName];
    var userHandler = userProps[handlerName];

    // Check
    if (states[handlerObj.state]) {
      if (userHandler) {
        return wrapHandler(userHandler, handlerObj.handler, this);
      }

      return handlerObj.handler.bind(this);
    }

    return userHandler && userHandler.bind(this);
  }

  return {
    onMouseEnter: getHandler.call(this, "onMouseEnter"),
    onMouseLeave: getHandler.call(this, "onMouseLeave"),
    onMouseDown: getHandler.call(this, "onMouseDown"),
    onMouseUp: getHandler.call(this, "onMouseUp"),
    onFocus: getHandler.call(this, "onFocus"),
    onBlur: getHandler.call(this, "onBlur")
  };
};

var BrowserStateMixin = {
  // Currently not called from extendedCreateClass
  getInitialState: getInitialState,

  getBrowserStateEvents: getBrowserStateEvents,

  handleMouseEnter: handleMouseEnter,

  handleMouseLeave: handleMouseLeave,

  handleMouseDown: handleMouseDown,

  handleMouseUp: handleMouseUp,

  handleFocus: handleFocus,

  handleBlur: handleBlur
};

module.exports = BrowserStateMixin;
