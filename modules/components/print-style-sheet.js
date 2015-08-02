var React = require('react');

var Style = require('./style.js');
var printStyles = require('../print-styles.js');

var PrintStyle = React.createClass({
  getInitialState: function () {
    return this._getStylesState();
  },

  componentDidMount: function () {
    printStyles.addListener(this._onChange);
  },

  componentWillUnmount: function () {
    printStyles.removeListener(this._onChange);
  },

  _onChange: function () {
    this.setState(this._getStylesState());
  },

  _getStylesState: function () {
    return {
      styles: printStyles.getPrintStyles()
    };
  },

  render: function () {
    return (
      <Style rules={
        {
          mediaQueries: {
            print: this.state.styles
          }
        }
      } />
    );
  }
});

module.exports = PrintStyle;
