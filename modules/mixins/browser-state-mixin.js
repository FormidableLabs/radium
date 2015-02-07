var forEach = require('lodash.foreach');
var merge = require('lodash.merge');

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
  },

  getStateStyles: function (states) {
    if (!states) {
      return;
    }

    var stateStyles;

    if (this.state.active) {
      stateStyles = states.active;
    } else if (this.state.focus) {
      stateStyles = states.focus;
    } else if (this.state.hover) {
      stateStyles = states.hover;
    }

    return stateStyles;
  },

  getBreakpointStyles: function (styles) {
    var breakpointStyles = merge({}, styles);

    forEach(styles.breakpoints, function (breakpoint, key) {
      if (this.props.breakpoints && this.props.breakpoints[key]) {
        var activeBreakpoint = breakpoint;

        if (!activeBreakpoint) {
          return;
        }

        merge(
          breakpointStyles,
          activeBreakpoint
        );
      }
    }, this);

    breakpointStyles.breakpoints = null;

    return breakpointStyles;
  },

  getModifierStyles: function (styles) {
    var modifierStyles = merge({}, styles.standard);

    forEach(styles.modifiers, function (modifier, key) {
      if (this.props[key]) {
        var modifierValue = this.props[key];
        var activeModifier;

        if (typeof modifierValue === 'string') {
          activeModifier = modifier[modifierValue];
        } else if (modifierValue === true || modifierValue === false) {
          activeModifier = modifier;
        } else {
          return;
        }

        if (!activeModifier) {
          return;
        }

        merge(
          modifierStyles,
          activeModifier
        );
      }
    }, this);

    return modifierStyles;
  },

  getStaticStyles: function (styles) {
    var elementStyles = this.getModifierStyles(styles);
    var mediaQueryStyles = this.getBreakpointStyles(elementStyles);

    return merge(
      {},
      mediaQueryStyles,
      this.props.style,
      this.getStateStyles(mediaQueryStyles.states)
    );
  },

  buildStyles: function (styles, computedStyleFunc) {
    var staticStyles = this.getStaticStyles(styles);
    var computedStyles;

    if (computedStyleFunc) {
      computedStyles = computedStyleFunc(staticStyles);
    }

    return merge({}, staticStyles, computedStyles);
  }
};

module.exports = BrowserStateMixin;
