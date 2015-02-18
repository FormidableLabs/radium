var React = require('react');
var hyphenateStyleName = require('react/lib/hyphenateStyleName');
var forEach = require('lodash.foreach');
var reduce = require('lodash.reduce');

function buildCssString (selector, rules) {
  // TODO: Better error checking for rules object
  if (!selector || !rules) {
    return;
  }

  var cssString = selector + "{";

  // Turn rules into css properties
  cssString += reduce(rules, function (s, val, styleName) {
    return s + hyphenateStyleName(styleName) + ":" + val + ";"
  }, "");

  // Close selector
  cssString += "}";

  return cssString;
}

var Style = React.createClass({
  render: function () {
    if (!this.props.selector) {
      throw new Error("Style tag requires a 'selector' property");
    }

    // Build styles from standard
    var styles = buildCssString(this.props.selector, this.props.standard)

    forEach(this.props.states, function (rules, state) {
      styles += buildCssString(ownerSelector + ":" + state, rules);
    });

    return (
      <style dangerouslySetInnerHTML={{__html: styles}}>
      </style>
    );
  }
});

module.exports = Style;
