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

class StyleRoot extends Component {
  constructor() {
    super(...arguments);

    _getStyleKeeper(this);
  }

  getChildContext() {
    return {_radiumStyleKeeper: _getStyleKeeper(this)};
  }

  render() {
    /* eslint-disable no-unused-vars */
    // Remove prop before being applied to DOM Node
    // As of React v15.2.0 - Unknown props issue warning
    const { _radiumDidResolveStyles, ...additionalProps } = this.props;
    /* eslint-enable */
    return (
      <div {...additionalProps}>
        {this.props.children}
        <StyleSheet />
      </div>
    );
  }
}

StyleRoot.contextTypes = {
  _radiumConfig: PropTypes.object,
  _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
};

StyleRoot.childContextTypes = {
  _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper)
};

StyleRoot = Enhancer(StyleRoot);

export default StyleRoot;
