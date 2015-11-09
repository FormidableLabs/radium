import React from 'react';

import Style from './style.js';
import printStyles from '../print-styles.js';

const PrintStyle = React.createClass({
  getInitialState() {
    return this._getStylesState();
  },

  componentDidMount() {
    this.subscription = printStyles.subscribe(this._onChange);
  },

  componentWillUnmount() {
    this.subscription.remove();
  },

  _onChange() {
    this.setState(this._getStylesState());
  },

  _getStylesState() {
    return {
      styles: printStyles.getPrintStyles()
    };
  },

  render() {
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

export default PrintStyle;
