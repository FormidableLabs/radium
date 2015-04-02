var React = require('react');
var Radium = require('../../modules/index');
var { MatchMediaItem } = Radium;

var Button = React.createClass(Radium.wrap({
  mixins: [ MatchMediaItem ],

  propTypes: {
    color: React.PropTypes.string
  },

  render: function () {
    return (
      <button
        style={[
          styles.base,
          this.props.color === 'red' && styles.red,
          this.props.style
        ]}>
        {this.props.children}
      </button>
    );
  }
}));

var styles = {
  base: {
    fontSize: 16,
    backgroundColor: "#0074d9",
    color: "#fff",
    border: 0,
    borderRadius: "0.3em",
    padding: "0.4em 1em",
    cursor: "pointer",
    outline: "none",

    ':hover': {
      backgroundColor: "#0088FF"
    },

    ':focus': {
      backgroundColor: "#0088FF"
    },

    ':active': {
      backgroundColor: "#005299",
      transform: "translateY(2px)",
    }
  },

  red: {
    backgroundColor: "#d90000",

    ':hover': {
      backgroundColor: "#FF0000"
    },
    ':focus': {
      backgroundColor: "#FF0000"
    },
    ':active': {
      backgroundColor: "#990000"
    }
  },

  mediaQueries: [
    {
      md: {
        padding: "0.6em 1.2em"
      }
    },
    {
      lg: {
        padding: "0.8em 1.5em"
      }
    }
  ],
};

module.exports = Button;
