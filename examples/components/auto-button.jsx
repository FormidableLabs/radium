var React = require('react');
var ReactCreateClassExtended = require('../../modules/react-create-class-extended.js');

var Button = React.createClass({

  radiumStyles: {
    standard: {
      backgroundColor: "red"
    }
  },

  render: function () {
    return (
      <button>
        {this.props.children}
      </button>
    );
  }
});

module.exports = Button;
