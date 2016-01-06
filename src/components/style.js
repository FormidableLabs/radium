/* @flow */

import cssRuleSetToString from '../css-rule-set-to-string';

import React, {PropTypes} from 'react';

const Style = React.createClass({
  propTypes: {
    radiumConfig: PropTypes.object,
    rules: PropTypes.object,
    scopeSelector: PropTypes.string
  },

  contextTypes: {
    _radiumConfig: PropTypes.object
  },

  getDefaultProps(): {scopeSelector: string} {
    return {
      scopeSelector: ''
    };
  },

  _buildStyles(styles: Object): string {
    const userAgent = (
      this.props.radiumConfig && this.props.radiumConfig.userAgent
    ) || (
      this.context &&
      this.context._radiumConfig &&
      this.context._radiumConfig.userAgent
    );

    return Object.keys(styles).reduce((accumulator, selector) => {
      const {scopeSelector} = this.props;
      const rules = styles[selector];

      if (selector === 'mediaQueries') {
        accumulator += this._buildMediaQueryString(rules);
      } else {
        const completeSelector = scopeSelector
          ? selector
            .split(',')
            .map(part => scopeSelector + ' ' + part.trim())
            .join(',')
          : selector;

        accumulator += cssRuleSetToString(completeSelector, rules, userAgent);
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

  _getContextMediaQueries(): {[mediaQuery: string]: string} {
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
