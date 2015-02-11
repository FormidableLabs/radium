var forEach = require('lodash.foreach');
var merge = require('lodash.merge');

var StyleResolverMixin = {
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
    var componentBreakpoints = this.props.breakpoints;

    if (this.state && this.state.breakpoints) {
      componentBreakpoints = this.state.breakpoints;
    }

    forEach(styles.breakpoints, function (breakpoint, key) {
      if (componentBreakpoints && componentBreakpoints[key]) {
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
      this.getStateStyles(mediaQueryStyles.states),
      { states: null }
    );
  },

  getComputedStyles: function (styles) {
    var computedStyles = {};

    // `styles.computed` can be a function that returns a style object.
    if (typeof styles.computed === 'function') {
      computedStyles = styles.computed(styles);
    // or it can be an object of functions mapping to individual rules.
    } else {
      forEach(styles.computed, function (computedCallback, key) {
        computedStyles[key] = computedCallback(styles);
      });
    }

    return merge(
      {},
      styles,
      computedStyles
    );
  },

  buildStyles: function (styles, computedStyleFunc) {
    var staticStyles = this.getStaticStyles(styles);

    return this.getComputedStyles(staticStyles);
  }
};

module.exports = StyleResolverMixin;
