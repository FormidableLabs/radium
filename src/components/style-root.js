/* @flow */

import React, {PureComponent} from 'react';
import type {Node} from 'react'
import PropTypes from 'prop-types';

import Enhancer from '../enhancer';
import StyleKeeper from '../style-keeper';
import StyleSheet from './style-sheet';
import type {Config} from '../config'

function _getStyleKeeper(instance): StyleKeeper {
  if (!instance._radiumStyleKeeper) {
    const userAgent = (instance.props.radiumConfig &&
      instance.props.radiumConfig.userAgent) ||
      (instance.context._radiumConfig &&
        instance.context._radiumConfig.userAgent);
    instance._radiumStyleKeeper = new StyleKeeper(userAgent);
  }

  return instance._radiumStyleKeeper;
}

type StyleRootProps = {
  radiumConfig: Config,
  children: Node,
}

class StyleRoot extends PureComponent<StyleRootProps> {
  constructor() {
    super(...arguments);

    _getStyleKeeper(this);
  }

  getChildContext() {
    return {_radiumStyleKeeper: _getStyleKeeper(this)};
  }

  _radiumStyleKeeper: StyleKeeper;

  render() {
    /* eslint-disable no-unused-vars */
    // Pass down all props except config to the rendered div.
    const {radiumConfig, ...otherProps} = this.props;
    /* eslint-enable no-unused-vars */

    return (
      <div {...otherProps}>
        {this.props.children}
        <StyleSheet />
      </div>
    );
  }
}

StyleRoot.contextTypes = {
  _radiumConfig: PropTypes.object,
  _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper),
};

StyleRoot.childContextTypes = {
  _radiumStyleKeeper: PropTypes.instanceOf(StyleKeeper),
};

StyleRoot = Enhancer(StyleRoot);

export default StyleRoot;
