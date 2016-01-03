/* @flow */

import React, {Component, PropTypes} from 'react';

import Enhancer from '../enhancer';
import StyleKeeper from '../style-keeper';
import StyleSheet from './style-sheet';

function _getStyleKeeper(instance): StyleKeeper {
  if (!instance._radiumStyleKeeper) {
    const userAgent = (
      instance.props.radiumConfig && instance.props.radiumConfig.userAgent
    ) || (
      instance.context._radiumConfig && instance.context._radiumConfig.userAgent
    );
    instance._radiumStyleKeeper = new StyleKeeper(userAgent);
  }

  return instance._radiumStyleKeeper;
}

@Enhancer
class StyleRoot extends Component {
  static contextTypes = {
    _radiumConfig: PropTypes.object,
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
  };

  static childContextTypes = {
    _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
  };

  constructor() {
    super(...arguments);

    _getStyleKeeper(this);
  }

  getChildContext() {
    return {_radiumStyleKeeper: _getStyleKeeper(this)};
  }

  render() {
    return (
      <div {...this.props}>
        {this.props.children}
        <StyleSheet />
      </div>
    );
  }
}

export default StyleRoot;
