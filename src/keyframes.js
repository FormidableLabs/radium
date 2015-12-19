/* @flow */

import cssRuleSetToString from './css-rule-set-to-string';

import ExecutionEnvironment from 'exenv';

export type Keyframes = {
  __radiumKeyframes: bool,
  __name: string,
  __getCSS(userAgent?: string): string
};

const animationNameSeed = ExecutionEnvironment.canUseDOM
  ? document.head.querySelectorAll('style').length
  : 0;

let animationIndex = 1;

export default function keyframes(
  keyframeRules: {[percentage: string]: {[key: string]: string|number}},
  name?: string,
): Keyframes {
  const animationName = (name ? name + '-' : '') +
    '-radium-animation-' + animationNameSeed + '-' + animationIndex;
  animationIndex += 1;

  return {
    __radiumKeyframes: true,
    __name: animationName,
    __getCSS(userAgent?: string) {
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
