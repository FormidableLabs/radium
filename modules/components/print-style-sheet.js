var React = require('react');

var Style = require('./style.js');
var printStyles = require('../print-styles.js');

var PrintStyle = React.createClass({
  getInitialState: function () {
    return this._getStylesState();
  },

  componentDidMount: function () {
    this.subscription = printStyles.subscribe(this._onChange);
  },

  componentWillUnmount: function () {
    this.subscription.remove();
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
