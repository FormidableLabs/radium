var React = require('react');
var Radium = require('../../modules/index');
var { StyleResolverMixin, BrowserStateMixin, MatchMediaItem } = Radium;

var Button = React.createClass({
  mixins: [ StyleResolverMixin, BrowserStateMixin, MatchMediaItem ],

  getStyles() {
    return {
      fontSize: 16,
      backgroundColor: "#0074d9",
      color: "#fff",
      border: 0,
      borderRadius: "0.3em",
      padding: "0.4em 1em",
      cursor: "pointer",
      outline: "none",

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

      states: [
        {
          hover: {
            backgroundColor: "#0088FF"
          }
        },
        {
          focus: {
            backgroundColor: "#0088FF"
          }
        },
        {
          active: {
            backgroundColor: "#005299",
            transform: "translateY(2px)",
          }
        }
      ],

      modifiers: [
        {
          color: {
            red: {
              backgroundColor: "#d90000",

              states: [
                {
                  hover: {
                    backgroundColor: "#FF0000"
                  }
                },
                {
                  focus: {
                    backgroundColor: "#FF0000"
                  }
                },
                {
                  active: {
                    backgroundColor: "#990000"
                  }
                }
              ]
            }
          }
        }
      ]
    };
  },

  render() {
    var styles = this.buildStyles(this.getStyles());

    return (
      <button
        style={styles}
        {...this.getBrowserStateEvents()}
        >
        {this.props.children}
      </button>
    );
  }
});

module.exports = Button;
