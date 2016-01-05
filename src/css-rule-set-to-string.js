/* @flow */

import appendPxIfNeeded from './append-px-if-needed';
import camelCasePropsToDashCase from './camel-case-props-to-dash-case';
import mapObject from './map-object';
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
  const rulesWithPx = mapObject(
    prefixedRules,
    (value, key) => appendPxIfNeeded(key, value)
  );
  const cssPrefixedRules = camelCasePropsToDashCase(rulesWithPx);
  const serializedRules = createMarkupForStyles(cssPrefixedRules);

  return selector + '{' + serializedRules + '}';
}
