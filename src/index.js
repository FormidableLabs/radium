import Enhancer from './enhancer';
import Plugins from './plugins';
import Style from './components/style';
import StyleRoot from './components/style-root';
import getState from './get-state';
import keyframes from './keyframes';
import {__clearStateForTests} from './resolve-styles';

function Radium(ComposedComponent: constructor) {
  return Enhancer(ComposedComponent);
}

Radium.Plugins = Plugins;
Radium.Style = Style;
Radium.StyleRoot = StyleRoot;
Radium.getState = getState;
Radium.keyframes = keyframes;
Radium.__clearStateForTests = __clearStateForTests;

export default Radium;
