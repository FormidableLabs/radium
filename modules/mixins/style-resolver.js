var merge = require('lodash/object/merge');

var StyleResolverMixin = {
  _getStateStyles: function (states, component) {
    if (!Array.isArray(states)) {
      return;
    }

    var stateStyles = {};

    states.forEach(function (stateObj) {
      var key = Object.keys(stateObj)[0];
      var state = stateObj[key];

      if (component.state[key]) {
        merge(stateStyles, state);
      }
    });

    return stateStyles;
  },

  _getMediaQueryStyles: function (styles) {
    if (!Array.isArray(styles.mediaQueries) || !this.context || !this.context.mediaQueries) {
      return styles;
    }

    var mediaQueryStyles = merge({}, styles);
    var componentMediaQueries = this.context.mediaQueries;

    styles.mediaQueries.forEach(function (mediaQueryObj) {
      var key = Object.keys(mediaQueryObj)[0];
      var mediaQuery = mediaQueryObj[key];

      if (componentMediaQueries && componentMediaQueries[key]) {
        var activeMediaQuery = mediaQuery;

        if (!activeMediaQuery) {
          return;
        }

        merge(
          mediaQueryStyles,
          activeMediaQuery
        );
      }
    });

    return mediaQueryStyles;
  },

  _getModifierStyles: function (styles, activeModifiers) {
    if (!activeModifiers || !Array.isArray(styles.modifiers)) {
      return styles;
    }

    var modifierStyles = merge({}, styles);

    styles.modifiers.forEach(function (modifierObj) {
      var key = Object.keys(modifierObj)[0];
      var modifier = modifierObj[key];

      if (activeModifiers[key]) {
        var modifierValue = activeModifiers[key];
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
    });

    return modifierStyles;
  },

  _getStaticStyles: function (styles, activeModifiers) {
    var elementStyles = this._getModifierStyles(styles, activeModifiers);
    var mediaQueryStyles = this._getMediaQueryStyles(elementStyles);

    return merge(
      {},
      mediaQueryStyles,
      this.props.style,
      this._getStateStyles(mediaQueryStyles.states, this),
      { states: null }
    );
  },

  _getComputedStyles: function (styles) {
    if (!styles.computed) {
      return styles;
    }

    var computedStyles = {};

    // `styles.computed` can be a function that returns a style object.
    if (typeof styles.computed === 'function') {
      computedStyles = styles.computed(styles);
    // or it can be an object of functions mapping to individual rules.
    } else {
      for (var key in styles.computed) {
        computedStyles[key] = styles.computed[key](styles);
      }
    }

    return merge(
      {},
      styles,
      computedStyles,
      { computed: null }
    );
  },

  buildStyles: function (styles, additionalModifiers, excludeProps) {
    var modifiers;

    if (excludeProps) {
      modifiers = additionalModifiers;
    } else {
      modifiers = merge({}, this.props, additionalModifiers);
    }

    var staticStyles = this._getStaticStyles(styles, modifiers);

    staticStyles.modifiers = null;
    staticStyles.mediaQueries = null;
    staticStyles.states = null;

    return this._getComputedStyles(staticStyles);
  }
};

module.exports = StyleResolverMixin;
