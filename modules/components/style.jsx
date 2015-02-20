var React = require('react');
var hyphenateStyleName = require('react/lib/hyphenateStyleName');
var reduce = require('lodash/collection/reduce');

function buildCssString (selector, rules) {
  // TODO: Better error checking for rules object
  if (!selector || !rules) {
    return;
  }

  return selector + "{" + Object.keys(rules).map(function (key) {
    return hyphenateStyleName(key) + ":" + rules[key] + ";";
  }).join("") + "}";
}

var Style = React.createClass({
  render: function () {
    // Throw error if someone passes in valid children that isn't an object
    if (this.props.children && typeof this.props.children !== "object") {
      throw new Error("Style tag requires an object for 'props.children'");
    }

    var scope = "";

    if (this.props.scopeSelector) {
      scope = this.props.scopeSelector + " ";
    }

    var styles = reduce(this.props.children, function (s, rules, selector) {
      return s += buildCssString(scope + selector, rules);
    }, "");

    if (styles) {
      return (
        <style dangerouslySetInnerHTML={{__html: styles}} />
      );
    } else {
      return null;
    }
  }
});

module.exports = Style;
