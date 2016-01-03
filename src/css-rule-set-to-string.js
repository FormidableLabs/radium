/* @flow */

import camelCasePropsToDashCase from './camel-case-props-to-dash-case';
import {getPrefixedStyle} from './prefixer';

function createMarkupForStyles(style: Object): string {
  return Object.keys(style).map(property => {
    return property + ': ' + style[property] + ';';
  }).join('\n');
}

export default function cssRuleSetToString(
  selector: string,
  rules: Object,
  userAgent: ?string,
): string {
  if (!rules) {
    return '';
  }

  const prefixedRules = getPrefixedStyle(rules, userAgent);
  const cssPrefixedRules = camelCasePropsToDashCase(prefixedRules);
  const serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
}
