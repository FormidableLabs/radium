var forEach = require('lodash.foreach');
var merge = require('lodash.merge');

var StyleResolverMixin = {
  _getStateStyles: function (states) {
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

  _getMediaQueryStyles: function (styles) {
    var mediaQueryStyles = merge({}, styles);
    var componentMediaQueries = this.props.mediaQueries;

    if (this.state && this.state.mediaQueries) {
      componentMediaQueries = this.state.mediaQueries;
    }

    forEach(styles.mediaQueries, function (mediaQuery, key) {
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
    }, this);

    mediaQueryStyles.mediaQueries = null;

    return mediaQueryStyles;
  },

  _getModifierStyles: function (styles, activeModifiers) {
    if (!activeModifiers) {
      return styles.standard;
    }

    var modifierStyles = merge({}, styles.standard);

    forEach(styles.modifiers, function (modifier, key) {
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
      this._getStateStyles(mediaQueryStyles.states),
      { states: null }
    );
  },

  _getComputedStyles: function (styles) {
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

    return this._getComputedStyles(staticStyles);
  }
};

module.exports = StyleResolverMixin;
