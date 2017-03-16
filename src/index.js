import Enhancer from './enhancer';
import Plugins from './plugins';
import Style from './components/style';
import StyleRoot from './components/style-root';
import getState from './get-state';
import keyframes from './keyframes';
import {__clearStateForTests, __setTestMode} from './resolve-styles';

function Radium(ComposedComponent: constructor) {
  return Enhancer(ComposedComponent);
}

Radium.Plugins = Plugins;
Radium.Style = Style;
Radium.StyleRoot = StyleRoot;
Radium.getState = getState;
Radium.keyframes = keyframes;

if (process.env.NODE_ENV !== 'production') {
  Radium.TestMode = {
    clearState: __clearStateForTests,
    disable: __setTestMode.bind(null, false),
    enable: __setTestMode.bind(null, true),
  };
}

export default Radium;
