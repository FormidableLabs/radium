/* @flow */

import React, {Component} from 'react';

import StyleKeeper from '../style-keeper';
import {withRadiumContexts, type WithRadiumContextsProps} from '../context';

class StyleSheet extends Component<WithRadiumContextsProps> {
  // eslint-disable-next-line react/sort-comp
  styleKeeper: StyleKeeper;

  constructor() {
    super(...arguments);

    if (!this.props.styleKeeperContext) {
      throw new Error('StyleRoot is required to use StyleSheet');
    }

    this.styleKeeper = this.props.styleKeeperContext;
    this._css = this.styleKeeper.getCSS();
  }

  componentDidMount() {
    this._subscription = this.styleKeeper.subscribe(this._onChange);
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
  _root: ?HTMLElement;
  _css: string;

  _onChange = () => {
    const nextCSS = this.styleKeeper.getCSS();

    if (nextCSS !== this._css) {
      if (this._root) {
        this._root.innerHTML = nextCSS;
      } else {
        throw new Error(
          'No root style object found, even after StyleSheet mount.'
        );
      }
      this._css = nextCSS;
    }
  };

  render() {
    return (
      <style
        dangerouslySetInnerHTML={{__html: this._css}}
        ref={c => {
          this._root = c;
        }}
      />
    );
  }
}

export default withRadiumContexts(StyleSheet);
