/* @flow */

import cssRuleSetToString from '../css-rule-set-to-string';

import React, {PropTypes, PureComponent} from 'react';

class Style extends PureComponent {
  static propTypes = {
    radiumConfig: PropTypes.object,
    rules: PropTypes.object,
    scopeSelector: PropTypes.string,
  };

  static contextTypes = {
    _radiumConfig: PropTypes.object,
  };

  static defaultProps: {scopeSelector: string} = {
    scopeSelector: '',
  };

  _buildStyles(styles: Object): string {
    const userAgent = (this.props.radiumConfig &&
      this.props.radiumConfig.userAgent) ||
      (this.context &&
        this.context._radiumConfig &&
        this.context._radiumConfig.userAgent);

    const {scopeSelector} = this.props;
    const rootRules = Object.keys(styles).reduce(
      (accumulator, selector) => {
        if (typeof styles[selector] !== 'object') {
          accumulator[selector] = styles[selector];
        }

        return accumulator;
      },
      {},
    );
    const rootStyles = Object.keys(rootRules).length
      ? cssRuleSetToString(scopeSelector || '', rootRules, userAgent)
      : '';

    return rootStyles +
      Object.keys(styles).reduce(
        (accumulator, selector) => {
          const rules = styles[selector];

          if (selector === 'mediaQueries') {
            accumulator += this._buildMediaQueryString(rules);
          } else if (typeof styles[selector] === 'object') {
            const completeSelector = scopeSelector
              ? selector
                  .split(',')
                  .map(part => scopeSelector + ' ' + part.trim())
                  .join(',')
              : selector;

            accumulator += cssRuleSetToString(
              completeSelector,
              rules,
              userAgent,
            );
          }

          return accumulator;
        },
        '',
      );
  }

  _buildMediaQueryString(
    stylesByMediaQuery: {[mediaQuery: string]: Object},
  ): string {
    let mediaQueryString = '';

    Object.keys(stylesByMediaQuery).forEach(query => {
      mediaQueryString += '@media ' +
        query +
        '{' +
        this._buildStyles(stylesByMediaQuery[query]) +
        '}';
    });

    return mediaQueryString;
  }

  render(): ?React.Element<any> {
    if (!this.props.rules) {
      return null;
    }

    const styles = this._buildStyles(this.props.rules);

    return <style dangerouslySetInnerHTML={{__html: styles}} />;
  }
}

export default Style;
