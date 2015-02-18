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
    var styles;

    // Throw error if someone passes in valid children that isn't an object
    if (this.props.children && typeof this.props.children !== "object") {
      throw new Error("Style tag requires an object for 'props.children'");
    }

    forEach(this.props.children, function (rules, selector) {
      styles = buildCssString(selector, rules);
    });

    if (styles) {
      return (
        <style dangerouslySetInnerHTML={{__html: styles}} />
      );
    } else {
      return false;
    }
  }
});

module.exports = Style;
