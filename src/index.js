import Enhancer from './enhancer';
import Plugins from './plugins';
import Style from './components/style';
import StyleRoot from './components/style-root';
import getState from './get-state';
import keyframes from './keyframes';
import resolveStyles from './resolve-styles';

function Radium(ComposedComponent: constructor) {
  return Enhancer(ComposedComponent);
}

// Legacy object support.
//
// Normally it would be disfavored to attach these to the `Radium` object
// because it defeats tree-shaking, using instead the ESM exports. But,
// the `Radium` `Enhancer` uses **all** of these, so there's no extra "cost"
// to them being explicitly on the `Radium` object.
Radium.Plugins = Plugins;
Radium.Style = Style;
Radium.StyleRoot = StyleRoot;
Radium.getState = getState;
Radium.keyframes = keyframes;

if (process.env.NODE_ENV !== 'production') {
  Radium.TestMode = {
    clearState: resolveStyles.__clearStateForTests,
    disable: resolveStyles.__setTestMode.bind(null, false),
    enable: resolveStyles.__setTestMode.bind(null, true)
  };
}

export default Radium;

// ESM re-exports
export {Plugins, Style, StyleRoot, getState, keyframes};
