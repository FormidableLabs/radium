/* @flow */

import camelCasePropsToDashCase from './camel-case-props-to-dash-case';
import createMarkupForStyles from './create-markup-for-styles';
import {getPrefixedStyle} from './prefixer';

import ExecutionEnvironment from 'exenv';

let isAnimationSupported = false;
let keyframesPrefixed = 'keyframes';

if (ExecutionEnvironment.canUseDOM) {
  // Animation feature detection and keyframes prefixing from MDN:
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Detecting_CSS_animation_support
  const domPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
  const element = (document.createElement('div'): any);

  if (element.style.animationName !== undefined) {
    isAnimationSupported = true;
  } else {
    domPrefixes.some(prefix => {
      if (element.style[prefix + 'AnimationName'] !== undefined) {
        keyframesPrefixed = '-' + prefix.toLowerCase() + '-keyframes';
        isAnimationSupported = true;
        return true;
      }
      return false;
    });
  }
}

let animationIndex = 1;
let animationStyleSheet = null;

if (isAnimationSupported) {
  animationStyleSheet = (document.createElement('style'): any);
  document.head.appendChild(animationStyleSheet);
}

// Simple animation helper that injects CSS into a style object containing the
// keyframes, and returns a string with the generated animation name.
export default function keyframes(
  keyframeRules: {[percentage: string]: {[key: string]: string|number}},
  componentName?: string,
  prefix: (style: Object, componentName: ?string) => Object = getPrefixedStyle
): string {
  const name = 'Animation' + animationIndex;
  animationIndex += 1;

  if (!isAnimationSupported) {
    return name;
  }

  const rule = '@' + keyframesPrefixed + ' ' + name + ' {\n' +
    Object.keys(keyframeRules).map(percentage => {
      const props = keyframeRules[percentage];
      const prefixedProps = prefix(props, componentName);
      const cssPrefixedProps = camelCasePropsToDashCase(prefixedProps);
      const serializedProps = createMarkupForStyles(cssPrefixedProps, '  ');
      return '  ' + percentage + ' {\n  ' + serializedProps + '\n  }';
    }).join('\n') +
    '\n}\n';

  // for flow
  /* istanbul ignore next */
  if (!animationStyleSheet) {
    throw new Error('keyframes not initialized properly');
  }

  animationStyleSheet.sheet.insertRule(
    rule,
    animationStyleSheet.sheet.cssRules.length
  );
  return name;
}
