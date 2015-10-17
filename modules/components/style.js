/* @flow */

var camelCasePropsToDashCase = require('../camel-case-props-to-dash-case');
var createMarkupForStyles = require('../create-markup-for-styles');
var Prefixer = require('../prefixer');

var React = require('react');

var buildCssString = function (
  selector: string,
  rules: Object,
  prefix: (rules: Object, componentName: string) => Object
): ?string {
  if (!selector || !rules) {
    return null;
  }

  var prefixedRules = prefix(rules, 'Style');
  var cssPrefixedRules = camelCasePropsToDashCase(prefixedRules);
  var serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
};

var Style = React.createClass({
  propTypes: {
    prefix: React.PropTypes.func.isRequired,

    rules: React.PropTypes.object,
    scopeSelector: React.PropTypes.string
  },

  getDefaultProps (): {scopeSelector: string} {
    return {
      prefix: Prefixer.getPrefixedStyle,
      scopeSelector: ''
    };
  },

  _buildStyles (styles: Object): string {
    return Object.keys(styles).reduce((accumulator, selector) => {
      var rules = styles[selector];

      if (selector === 'mediaQueries') {
        accumulator += this._buildMediaQueryString(rules);
      } else {
        var completeSelector = (
          this.props.scopeSelector ?
            this.props.scopeSelector + ' ' :
            ''
          ) + selector;
        accumulator += buildCssString(completeSelector, rules, this.props.prefix) || '';
      }

      return accumulator;
    }, '');
  },

  _buildMediaQueryString (
    stylesByMediaQuery: {[mediaQuery: string]: Object}
  ): string {
    var contextMediaQueries = this._getContextMediaQueries();
    var mediaQueryString = '';

    Object.keys(stylesByMediaQuery).forEach(query => {
      var completeQuery = contextMediaQueries[query] ?
        contextMediaQueries[query] :
        query;
      mediaQueryString += '@media ' + completeQuery + '{' +
        this._buildStyles(stylesByMediaQuery[query]) +
        '}';
    });

    return mediaQueryString;
  },

  _getContextMediaQueries (): {[mediaQuery: string]: Object} {
    var contextMediaQueries = {};
    if (this.context && this.context.mediaQueries) {
      Object.keys(this.context.mediaQueries).forEach(function (query) {
        contextMediaQueries[query] = this.context.mediaQueries[query].media;
      }.bind(this));
    }

    return contextMediaQueries;
  },

  render (): ?ReactElement {
    if (!this.props.rules) {
      return null;
    }

    var styles = this._buildStyles(this.props.rules);

    return (
      <style dangerouslySetInnerHTML={{__html: styles}} />
    );
  }
});

module.exports = Style;
