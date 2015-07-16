var createMarkupForStyles = require('../create-markup-for-styles');
var Prefixer = require('../prefixer');

var React = require('react');

var buildCssString = function (component, selector, rules) {
  if (!selector || !rules) {
    return;
  }

  var prefixedRules = Prefixer.getPrefixedStyle(component, rules, 'css');
  var serializedRules = createMarkupForStyles(prefixedRules);

  return selector + '{' + serializedRules + '}';
};

var Style = React.createClass({
  propTypes: {
    rules: React.PropTypes.object,
    scopeSelector: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      scopeSelector: ''
    };
  },

  _buildStyles: function (styles) {
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
        accumulator += buildCssString(this, completeSelector, rules);
      }

      return accumulator;
    }, '');
  },

  _buildMediaQueryString: function (mediaQueryObj) {
    var contextMediaQueries = this._getContextMediaQueries();
    var mediaQueryString = '';

    Object.keys(mediaQueryObj).forEach(query => {
      var completeQuery = contextMediaQueries[query] ?
        contextMediaQueries[query] :
        query;
      mediaQueryString += '@media ' + completeQuery + '{' +
        this._buildStyles(mediaQueryObj[query]) +
        '}';
    });

    return mediaQueryString;
  },

  _getContextMediaQueries: function () {
    var contextMediaQueries = {};
    if (this.context && this.context.mediaQueries) {
      Object.keys(this.context.mediaQueries).forEach(function (query) {
        contextMediaQueries[query] = this.context.mediaQueries[query].media;
      }.bind(this));
    }

    return contextMediaQueries;
  },

  render: function () {
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
