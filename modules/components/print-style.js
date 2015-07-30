var React = require('react');

var Style = require('./style.js');
var printStyles = require('../print-styles.js');

var PrintStyle = React.createClass({

  getInitialState: function () {
    return this.getStylesState();
  },

  componentDidMount: function () {
    printStyles.addListener(this.onChange);
  },

  componentWillUnmount: function () {
    printStyles.removeListener(this.onChange);
  },

  onChange: function () {
    this.setState(this.getStylesState());
  },

  getStylesState: function () {
    return {
      styles: printStyles.getPrintStyles()
    };
  },

  render: function () {
    return (
      <Style
        rules={
          {
            mediaQueries: {
              print: this.state.styles
            }
          }
        }
      />
    );
  }

});

module.exports = PrintStyle;
