/* @flow */

import React, {Component} from 'react';

import Style from './style.js';
import StyleKeeper from '../style-keeper';

export default class StyleSheet extends Component {
  _subscription: {remove: () => void};

  // $FlowStaticPropertyWarning
  static contextTypes = {
    _radiumStyleKeeper: React.PropTypes.instanceOf(StyleKeeper)
  };

  constructor() {
    super();

    this.state = this._getCSSState();
  }

  componentDidMount() {
    this._subscription = this.context._radiumStyleKeeper.subscribe(
      this._onChange
    );
    this._onChange();
  }

  componentWillUnmount() {
    if (this._subscription) {
      this._subscription.remove();
    }
  }

  _getCSSState(): {css: string} {
    return {css: this.context._radiumStyleKeeper.getCSS()};
  }

  _onChange() {
    this.setState(this._getCSSState());
  }

  render(): ReactElement {
    return (
      <style dangerouslySetInnerHTML={{__html: this.state.css}} />
    );
  }
}
