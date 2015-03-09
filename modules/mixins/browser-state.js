var globalMouseUp = require("./util/global-mouseup");
var subscribeToGlobalMouseUp = globalMouseUp.subscribeToGlobalMouseUp;
var unsubscribeFromGlobalMouseUp = globalMouseUp.unsubscribeFromGlobalMouseUp;

var BrowserStateMixin = {

  componentDidMount: function () {
    subscribeToGlobalMouseUp(this);
  },

  componentWillUnmount: function () {
    unsubscribeFromGlobalMouseUp(this);
  },

  getInitialState: function () {
    return {
      hover: false,
      focus: false,
      active: false
    };
  },

  getBrowserStateEvents: function () {
    return {
      onMouseEnter: this._handleMouseEnter,
      onMouseLeave: this._handleMouseLeave,
      onMouseDown: this._handleMouseDown,
      onMouseUp: this._handleMouseUp,
      onFocus: this._handleFocus,
      onBlur: this._handleBlur
    };
  },

  _callRadiumHandler: function (handler, ev) {
    var currentHandler = this.props[handler];

    if (currentHandler) {
      currentHandler(ev);
    }
  },

  _handleMouseEnter: function (ev) {
    this._callRadiumHandler("onMouseEnter", ev);

    this.setState({
      hover: true
    });
  },

  _handleMouseLeave: function (ev) {
    this._callRadiumHandler("onMouseLeave", ev);

    this.setState({
      hover: false
    });
  },

  _handleMouseDown: function (ev) {
    this._callRadiumHandler("onMouseDown", ev);

    this.setState({
      active: true
    });
  },

  _handleMouseUp: function (ev) {
    this._callRadiumHandler("onMouseUp", ev);

    this.setState({
      active: false
    });
  },

  handleGlobalMouseUp: function (ev) {
    if (ev.toElement === this.getDOMNode()) {
      return;
    }
    if (this.state.active) {
      this.setState({
        active: false
      });
    }
  },

  _handleFocus: function (ev) {
    this._callRadiumHandler("onFocus", ev);

    this.setState({
      focus: true
    });
  },

  _handleBlur: function (ev) {
    this._callRadiumHandler("onBlur", ev);

    this.setState({
      focus: false
    });
  }
};

module.exports = BrowserStateMixin;
