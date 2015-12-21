/* @flow */

import cssRuleSetToString from './css-rule-set-to-string';

export type Keyframes = {
  __radiumKeyframes: bool,
  __process(userAgent?: string): {animationName: string, css: string},
};

// a simple djb2 hash based on hash-string:
// https://github.com/MatthewBarker/hash-string/blob/master/source/hash-string.js
function hash(text) {
  let hashValue = 5381;
  let index = text.length - 1;

  while (index) {
    hashValue = (hashValue * 33) ^ text.charCodeAt(index);
    index -= 1;
  }

  return (hashValue >>> 0).toString(16);
}

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
