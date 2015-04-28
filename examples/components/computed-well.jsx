var React = require('react');
var Radium = require('../../modules/index');

var ComputedWell = React.createClass(Radium.wrap({
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
    return (
      <form style={this.getStyles()} onSubmit={this.handleSubmit}>
        <input ref='input' type='text' placeholder="black" />

        <button>Change Background Color</button>
      </form>
    );
  }
}));

module.exports = ComputedWell;
