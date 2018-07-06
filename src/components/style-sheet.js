/* @flow */

import React, {PureComponent} from 'react';
import type {Node} from 'react';
import PropTypes from 'prop-types';

import StyleKeeper from '../style-keeper';

export default class StyleSheet extends PureComponent<{}, {css: string}> {
  static contextTypes = {
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
  };

  constructor() {
    super(...arguments);

    this.state = this._getCSSState();
  }

  componentDidMount() {
    this._isMounted = true;
    this._subscription = this.context._radiumStyleKeeper.subscribe(
      this._onChange
    );
    setTimeout(this._onChange, 0);
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this._subscription) {
      this._subscription.remove();
    }
  }

  _isMounted: ?boolean;
  _subscription: ?{remove: () => void};

  _getCSSState(): {css: string} {
    return {css: this.context._radiumStyleKeeper.getCSS()};
  }

  _onChange = () => {
    if (this._isMounted) {
      this.setState(this._getCSSState());
    }
  };

  render(): Node {
    return <style dangerouslySetInnerHTML={{__html: this.state.css}} />;
  }
}
