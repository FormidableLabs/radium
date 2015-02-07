var BrowserStateMixin = {
  getInitialState: function () {
    return {
      hover: false,
      focus: false,
      active: false
    };
  },

  getBrowserStateEvents: function () {
    return {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    };
  },

  callRadiumHandler: function (handler, ev) {
    var currentHandler = this.props[handler];

    if (currentHandler) {
      currentHandler(ev);
    }
  },

  handleMouseEnter: function (ev) {
    this.callRadiumHandler("onMouseEnter", ev);

    this.setState({
      hover: true
    });
  },

  handleMouseLeave: function (ev) {
    this.callRadiumHandler("onMouseLeave", ev);

    this.setState({
      hover: false,
      active: false
    });
  },

  handleMouseDown: function (ev) {
    this.callRadiumHandler("onMouseDown", ev);

    this.setState({
      active: true
    });
  },

  handleMouseUp: function (ev) {
    this.callRadiumHandler("onMouseUp", ev);

    this.setState({
      active: false
    });
  },

  handleFocus: function (ev) {
    this.callRadiumHandler("onFocus", ev);

    this.setState({
      focus: true
    });
  },

  handleBlur: function (ev) {
    this.callRadiumHandler("onBlur", ev);

    this.setState({
      focus: false
    });
  }
};

module.exports = BrowserStateMixin;
