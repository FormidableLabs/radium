/** @flow */

import type {PluginConfig, PluginResult} from './index';

export default function visited(
  {
    addCSS,
    appendImportantToEachValue,
    config,
    cssRuleSetToString,
    hash,
    props,
    style
  }: PluginConfig
): PluginResult {
  // eslint-disable-line no-shadow
  let className = props.className;

  const newStyle = Object.keys(style).reduce(
    (newStyleInProgress, key) => {
      let value = style[key];
      if (key === ':visited') {
        value = appendImportantToEachValue(value);
        const ruleCSS = cssRuleSetToString('', value, config.userAgent);
        const visitedClassName = 'rad-' + hash(ruleCSS);
        const css = '.' + visitedClassName + ':visited' + ruleCSS;

        addCSS(css);
        className = (className ? className + ' ' : '') + visitedClassName;
      } else {
        newStyleInProgress[key] = value;
      }

      return newStyleInProgress;
    },
    {}
  );

  return {
    props: className === props.className ? null : {className},
    style: newStyle
  };
}
