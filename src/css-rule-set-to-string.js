/* @flow */

import camelCasePropsToDashCase from './camel-case-props-to-dash-case';
import createMarkupForStyles from './create-markup-for-styles';
import {getPrefixedStyle} from './prefixer';

export default function cssRuleSetToString(
  selector: string,
  rules: Object,
  userAgent: ?string,
): string {
  if (!selector || !rules) {
    return '';
  }

  const prefixedRules = getPrefixedStyle(rules, userAgent);
  const cssPrefixedRules = camelCasePropsToDashCase(prefixedRules);
  const serializedRules = createMarkupForStyles(cssPrefixedRules, '  ');

  return selector + '{\n' + serializedRules + '\n}';
};
