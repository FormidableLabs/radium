/* @flow */

import cssRuleSetToString from './css-rule-set-to-string';

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

const animationNameSeed = ExecutionEnvironment.canUseDOM
  ? document.head.querySelectorAll('style').length
  : 0;

let animationIndex = 1;

export default function keyframes(
  keyframeRules: {[percentage: string]: {[key: string]: string|number}},
  name?: string,
): {
  __radiumKeyframes: bool,
  name: string,
  getCSS(userAgent: string): string
} {
  const animationName = (name ? name + '-' : '') + '-radium-animation-' + animationNameSeed + '-' + animationIndex;
  animationIndex += 1;

  return {
    __radiumKeyframes: true,
    name: animationName,
    getCSS(userAgent: string) {
      const keyframesPrefixed = '-webkit-keyframes';
      return '@' + keyframesPrefixed + ' ' + animationName + ' {\n' +
        Object.keys(keyframeRules).map(percentage =>
          cssRuleSetToString(
            percentage,
            keyframeRules[percentage],
            userAgent
          )
        ).join('\n') +
        '\n}\n';
    }
  };
}
