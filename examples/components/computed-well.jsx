var React = require('react');
var Radium = require('../../modules/index');
var { BrowserStateMixin, MatchMediaMixin } = Radium;

var ComputedWell = React.createClass({
  mixins: [ BrowserStateMixin ],

  getInitialState: function () {
    dynamicBg: null
  },

  getStyles: function () {
    return {
      standard: {
        padding: "1em",
        borderRadius: 5,
        background: "#000"
      }
    };
  },

  buildComputedStyles: function (baseStyles) {
    var computedStyles = {};

    computedStyles.backgroundColor = this.state.dynamicBg;

    return computedStyles;
  },

  handleSubmit: function (ev) {
    ev.preventDefault();

    this.setState({
      dynamicBg: this.refs.input.getDOMNode().value
    });
  },

  render: function () {
    var styles = this.buildStyles(this.getStyles(), this.buildComputedStyles);

    return (
      <form style={styles} onSubmit={this.handleSubmit}>
        <input ref='input' type='text' placeholder="black" />

        <button>Change Background Color</button>
      </form>
    );
  }
});

module.exports = ComputedWell;
