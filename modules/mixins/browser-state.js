var BrowserStateMixin = {
  getInitialState() {
    return {
      hover: false,
      focus: false,
      active: false
    };
  },

  getBrowserStateEvents() {
    return {
      onMouseEnter: this._handleMouseEnter,
      onMouseLeave: this._handleMouseLeave,
      onMouseDown: this._handleMouseDown,
      onMouseUp: this._handleMouseUp,
      onFocus: this._handleFocus,
      onBlur: this._handleBlur
    };
  },

  _callRadiumHandler(handler, ev) {
    var currentHandler = this.props[handler];

    if (currentHandler) {
      currentHandler(ev);
    }
  },

  _handleMouseEnter(ev) {
    this._callRadiumHandler("onMouseEnter", ev);

    this.setState({
      hover: true
    });
  },

  _handleMouseLeave(ev) {
    this._callRadiumHandler("onMouseLeave", ev);

    this.setState({
      hover: false,
      active: false
    });
  },

  _handleMouseDown(ev) {
    this._callRadiumHandler("onMouseDown", ev);

    this.setState({
      active: true
    });
  },

  _handleMouseUp(ev) {
    this._callRadiumHandler("onMouseUp", ev);

    this.setState({
      active: false
    });
  },

  _handleFocus(ev) {
    this._callRadiumHandler("onFocus", ev);

    this.setState({
      focus: true
    });
  },

  _handleBlur(ev) {
    this._callRadiumHandler("onBlur", ev);

    this.setState({
      focus: false
    });
  }
};

module.exports = BrowserStateMixin;
