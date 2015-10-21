/* @flow */

const camelCasePropsToDashCase = require('../camel-case-props-to-dash-case');
const createMarkupForStyles = require('../create-markup-for-styles');
const Prefixer = require('../prefixer');

const React = require('react');

const buildCssString = function (
  selector: string,
  rules: Object,
  prefix: (rules: Object, componentName: string) => Object
): ?string {
  if (!selector || !rules) {
    return null;
  }

  const prefixedRules = prefix(rules, 'Style');
  const cssPrefixedRules = camelCasePropsToDashCase(prefixedRules);
  const serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
};

const Style = React.createClass({
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
      const rules = styles[selector];

      if (selector === 'mediaQueries') {
        accumulator += this._buildMediaQueryString(rules);
      } else {
        const completeSelector = (
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
    const contextMediaQueries = this._getContextMediaQueries();
    let mediaQueryString = '';

    Object.keys(stylesByMediaQuery).forEach(query => {
      const completeQuery = contextMediaQueries[query] ?
        contextMediaQueries[query] :
        query;
      mediaQueryString += '@media ' + completeQuery + '{' +
        this._buildStyles(stylesByMediaQuery[query]) +
        '}';
    });

    return mediaQueryString;
  },

  _getContextMediaQueries (): {[mediaQuery: string]: Object} {
    const contextMediaQueries = {};
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

    const styles = this._buildStyles(this.props.rules);

    return (
      <style dangerouslySetInnerHTML={{__html: styles}} />
    );
  }
});

module.exports = Style;
