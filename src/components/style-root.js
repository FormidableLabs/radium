/* @flow */

import React, {useContext, useRef} from 'react';
import type {Node} from 'react';

import Enhancer from '../enhancer';
import StyleKeeper from '../style-keeper';
import StyleSheet from './style-sheet';
import type {Config} from '../config';
import {StyleKeeperContext, RadiumConfigContext} from '../context';

function getStyleKeeper(
  configProp: Config,
  configContext?: Config
): StyleKeeper {
  const userAgent =
    (configProp && configProp.userAgent) ||
    (configContext && configContext.userAgent);

  return new StyleKeeper(userAgent);
}

type StyleRootProps = {
  radiumConfig: Config,
  children: Node
};

const StyleRootInner = Enhancer(({children, ...otherProps}: StyleRootProps) => (
  <div {...otherProps}>
    {children}
    <StyleSheet />
  </div>
));

const StyleRoot = (props: StyleRootProps) => {
  /* eslint-disable no-unused-vars */
  // Pass down all props except config to the rendered div.
  /* eslint-enable no-unused-vars */
  const {radiumConfig} = props;

  const configContext = useContext(RadiumConfigContext);
  const styleKeeper = useRef<StyleKeeper>(
    getStyleKeeper(radiumConfig, configContext)
  );

  return (
    <StyleKeeperContext.Provider value={styleKeeper.current}>
      <StyleRootInner {...props} />
    </StyleKeeperContext.Provider>
  );
};

export default StyleRoot;
