/* @flow */

import camelCasePropsToDashCase from '../camel-case-props-to-dash-case';
import createMarkupForStyles from '../create-markup-for-styles';
import {getPrefixedStyle} from '../prefixer';

import React from 'react';

const buildCssString = function(
  selector: string,
  rules: Object,
  userAgent: ?string,
): string {
  if (!selector || !rules) {
    return '';
  }

  const prefixedRules = getPrefixedStyle(rules, 'Style', userAgent);
  const cssPrefixedRules = camelCasePropsToDashCase(prefixedRules);
  const serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
};

const Style = React.createClass({
  propTypes: {
    rules: React.PropTypes.object,
    scopeSelector: React.PropTypes.string
  },

  contextTypes: {
    radiumConfig: React.PropTypes.object
  },

  getDefaultProps(): {scopeSelector: string} {
    return {
      prefix: getPrefixedStyle,
      scopeSelector: ''
    };
  },

  _buildStyles(styles: Object): string {
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
        accumulator += buildCssString(
          completeSelector,
          rules,
          this.context && this.context.radiumConfig &&
            this.context.radiumConfig.userAgent
        );
      }

      return accumulator;
    }, '');
  },

  _buildMediaQueryString(
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

  _getContextMediaQueries(): {[mediaQuery: string]: Object} {
    const contextMediaQueries = {};
    if (this.context && this.context.mediaQueries) {
      Object.keys(this.context.mediaQueries).forEach(query => {
        contextMediaQueries[query] = this.context.mediaQueries[query].media;
      });
    }

    return contextMediaQueries;
  },

  render(): ?ReactElement {
    if (!this.props.rules) {
      return null;
    }

    const styles = this._buildStyles(this.props.rules);

    return (
      <style dangerouslySetInnerHTML={{__html: styles}} />
    );
  }
});

export default Style;
