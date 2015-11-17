/* @flow */

import React from 'react';

import Style from './style.js';
import StyleKeeper from '../style-keeper';

const StyleSheet = React.createClass({
  _subscription: ((null: any): {remove: () => void}),

  contextTypes: {
    _radiumStyleKeeper: React.PropTypes.instanceOf(StyleKeeper)
  },

  getInitialState() {
    return this._getCSSState();
  },

  componentDidMount() {
    this._subscription = this.context._radiumStyleKeeper.subscribe(
      this._onChange
    );
    this._onChange();
  },

  componentWillUnmount() {
    this._subscription.remove();
  },

  _getCSSState(): {css: string} {
    return {css: this.context._radiumStyleKeeper.getCSS()};
  },

  _onChange() {
    this.setState(this._getCSSState());
  },

  render(): ReactElement {
    return (
      <style dangerouslySetInnerHTML={{__html: this.state.css}} />
    );
  }
});

export default StyleSheet;
