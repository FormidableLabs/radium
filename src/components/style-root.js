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

    // Use a custom StyleKeeper if provided in props
    instance._radiumStyleKeeper = instance.props.styleKeeper
      ? new instance.props.styleKeeper(userAgent)
      : new StyleKeeper(userAgent);
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
    return (
      <div {...this.props}>
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

StyleRoot.propTypes = {
  styleKeeper: PropTypes.func
};

StyleRoot = Enhancer(StyleRoot);

export default StyleRoot;
