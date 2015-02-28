var React = require('react');
var Radium = require('../../modules/index');
var { StyleResolverMixin } = Radium;

var ComputedWell = React.createClass({
  mixins: [ StyleResolverMixin ],

  getInitialState: function () {
    return {
      dynamicBg: '#000'
    }
  },

  getStyles: function () {
    return {
      padding: "1em",
      borderRadius: 5,
      background: this.state.dynamicBg
    };
  },

  handleSubmit: function (ev) {
    ev.preventDefault();

    this.setState({
      dynamicBg: this.refs.input.getDOMNode().value
    });
  },

  render: function () {
    var styles = this.buildStyles(this.getStyles());

    return (
      <form style={styles} onSubmit={this.handleSubmit}>
        <input ref='input' type='text' placeholder="black" />

        <button>Change Background Color</button>
      </form>
    );
  }
});

module.exports = ComputedWell;
