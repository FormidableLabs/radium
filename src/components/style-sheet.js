/* @flow */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import StyleKeeper from '../style-keeper';

export default class StyleSheet extends Component {
  static contextTypes = {
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
  };

  constructor() {
    super(...arguments);
    this._css = this.context._radiumStyleKeeper.getCSS();
  }

  componentDidMount() {
    this._subscription = this.context._radiumStyleKeeper.subscribe(
      this._onChange
    );
    this._onChange();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (this._subscription) {
      this._subscription.remove();
    }
  }

  _subscription: ?{remove: () => void};
  _root: HTMLElement;
  _css: string;

  _onChange = () => {
    const nextCSS = this.context._radiumStyleKeeper.getCSS();

    if (nextCSS !== this._css) {
      this._root.innerHTML = nextCSS;
      this._css = nextCSS;
    }
  };

  render(): React.Element<any> {
    return (
      <style
        dangerouslySetInnerHTML={{__html: this._css}}
        ref={c => { this._root = c; }}
      />
    );
  }
}
