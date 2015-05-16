var Radium = require('../../modules');
var React = require('react');

class Button extends React.Component {
  render() {
    return (
      <button
        onClick={this.props.onClick}
        style={[
          styles.base,
          this.props.color === 'red' && styles.red,
          this.props.style
        ]}>
        {this.props.children}
      </button>
    );
  }
}

Button.propTypes = {
  color: React.PropTypes.string,
  onClick: React.PropTypes.func
};

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

    '@media (min-width: 992px)': {
      padding: "0.6em 1.2em"
    },

    '@media (min-width: 1200px)': {
      padding: "0.8em 1.5em"
    },

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
  }
};

module.exports = Radium.Enhancer(Button);
