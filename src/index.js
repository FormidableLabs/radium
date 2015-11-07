import Enhancer from './enhancer';
import Plugins from './plugins';
import PrintStyleSheet from './components/print-style-sheet';
import Style from './components/style';
import getState from './get-state';
import keyframes from './keyframes';
import {__clearStateForTests} from './resolve-styles';

function Radium(ComposedComponent: constructor) {
  return Enhancer(ComposedComponent);
}

Radium.Plugins = Plugins;
Radium.PrintStyleSheet = PrintStyleSheet;
Radium.Style = Style;
Radium.getState = getState;
Radium.keyframes = keyframes;
Radium.__clearStateForTests = __clearStateForTests;

export default Radium;
