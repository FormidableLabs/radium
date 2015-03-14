var React = require('react');
var CSSPropertyOperations = require('react/lib/CSSPropertyOperations');
var reduce = require('lodash/collection/reduce');

function buildCssString (selector, rules) {
  if (!selector || !rules) {
    return;
  }

  return selector + '{' +
    CSSPropertyOperations.createMarkupForStyles(rules) +
  '}';
}

var Style = React.createClass({
  propTypes: {
    scopeSelector: React.PropTypes.string,
    rules: React.PropTypes.arrayOf(React.PropTypes.object)
  },

  getDefaultProps: function () {
    return {
      scopeSelector: ''
    };
  },

  render: function () {
    if (!this.props.rules) {
      return null;
    }

    var styles = reduce(this.props.rules, function (s, item) {
      var selector = Object.keys(item)[0];
      var rules = item[selector];
      var completeSelector = this.props.scopeSelector + ' ' + selector;

      return s += buildCssString(completeSelector, rules);
    }, '', this);

    return React.createElement(
      'style',
      {dangerouslySetInnerHTML: {__html: styles}}
    );
  }
});

module.exports = Style;
