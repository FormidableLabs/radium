/* @flow */

import cssRuleSetToString from './css-rule-set-to-string';
import hash from './hash';

export type Keyframes = {
  __radiumKeyframes: bool,
  __process(userAgent?: string): {animationName: string, css: string},
};

export default function keyframes(
  keyframeRules: {[percentage: string]: {[key: string]: string|number}},
  name?: string,
): Keyframes {
  return {
    __radiumKeyframes: true,
    __process(userAgent) {
      const keyframesPrefixed = '-webkit-keyframes';
      const rules = Object.keys(keyframeRules).map(percentage =>
        cssRuleSetToString(
          percentage,
          keyframeRules[percentage],
          userAgent
        )
      ).join('\n');
      const animationName = (name ? name + '-' : '') + 'radium-animation-' + hash(rules);
      const css = '@' + keyframesPrefixed + ' ' + animationName + ' {\n' +
        rules +
        '\n}\n';
      return {css, animationName};
    }
  };
}
