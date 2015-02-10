var forEach = require('lodash.foreach');
var merge = require('lodash.merge');

var getStateStyles = function (states) {
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
};

var getBreakpointStyles = function (styles) {
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
};

var getModifierStyles = function (styles) {
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
};

var getStaticStyles = function (styles) {
  var elementStyles = getModifierStyles.call(this, styles);
  var mediaQueryStyles = getBreakpointStyles.call(this, elementStyles);

  return merge(
    {},
    mediaQueryStyles,
    this.props.style,
    getStateStyles.call(this, mediaQueryStyles.states)
  );
};

var buildStyles = function (styles, computedStyleFunc) {
  var staticStyles = getStaticStyles.call(this, styles);
  var computedStyles;

  if (computedStyleFunc) {
    computedStyles = computedStyleFunc(staticStyles);
  }

  return merge({}, staticStyles, computedStyles);
}

var StyleResolverMixin = {
  buildStyles: buildStyles,
  getStaticStyles: getStaticStyles,
  getModifierStyles: getModifierStyles,
  getBreakpointStyles: getBreakpointStyles,
  getStateStyles: getStateStyles
};

module.exports = StyleResolverMixin;
