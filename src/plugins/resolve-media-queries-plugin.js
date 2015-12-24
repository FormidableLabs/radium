/** @flow */

import type {MatchMediaType} from '../config';
import type {PluginConfig, PluginResult} from './index';

import appendImportantToEachValue from '../append-important-to-each-value';
import hash from '../hash';

let _windowMatchMedia;
const _getWindowMatchMedia = function(ExecutionEnvironment) {
  if (_windowMatchMedia === undefined) {
    _windowMatchMedia = !!ExecutionEnvironment.canUseDOM &&
      !!window &&
      !!window.matchMedia &&
      (mediaQueryString => window.matchMedia(mediaQueryString)) ||
      null;
  }
  return _windowMatchMedia;
};

function filterObject(
  obj: Object,
  predicate: (value: any, key: string) => bool
): Object {
  return Object.keys(obj)
    .filter(key => predicate(obj[key], key))
    .reduce(
      (result, key) => {
        result[key] = obj[key];
        return result;
      },
      {}
    );
}

export default function resolveMediaQueries({
  ExecutionEnvironment,
  addCSS,
  config,
  cssRuleSetToString,
  getComponentField,
  getGlobalState,
  isNestedStyle,
  mergeStyles,
  props,
  setState,
  style
}: PluginConfig): PluginResult { // eslint-disable-line no-shadow
  // Remove media queries
  let newStyle = Object.keys(style).reduce(
    (styleWithoutMedia, key) => {
      if (key.indexOf('@media') !== 0) {
        styleWithoutMedia[key] = style[key];
      }
      return styleWithoutMedia;
    },
    {}
  );

  let newProps = undefined;
  let className = props.className || '';
  // Pull out top-level rules and convert them to CSS
  Object.keys(style)
  .filter(name => name.indexOf('@media') === 0)
  .map(query => {
    const topLevelRules = appendImportantToEachValue(
      filterObject(
        style[query],
        value => !isNestedStyle(value),
      )
    );

    if (!Object.keys(topLevelRules).length) {
      return;
    }

    const ruleCSS = cssRuleSetToString(
      '',
      topLevelRules,
      config.userAgent
    );

    const mediaQueryClassName = hash(ruleCSS);
    const css = query + '{ .' + mediaQueryClassName + ruleCSS + '}';

    addCSS(css);


    className += ' ' + mediaQueryClassName;
  });

  newProps = {className};

  const matchMedia: ?MatchMediaType = config.matchMedia ||
    _getWindowMatchMedia(ExecutionEnvironment);

  if (!matchMedia) {
    return {
      props: newProps,
      style: newStyle
    };
  }

  const listenersByQuery = {
    ...getComponentField('_radiumMediaQueryListenersByQuery')
  };
  const newComponentFields = {
    _radiumMediaQueryListenersByQuery: listenersByQuery
  };
  const mediaQueryListByQueryString =
    getGlobalState('mediaQueryListByQueryString') || {};

  Object.keys(style)
  .filter(name => name.indexOf('@media') === 0)
  .map(query => {
    const nestedRules = filterObject(style[query], isNestedStyle);

    if (!Object.keys(nestedRules).length) {
      return;
    }

    query = query.replace('@media ', '');

    // Create a global MediaQueryList if one doesn't already exist
    let mql = mediaQueryListByQueryString[query];
    if (!mql && matchMedia) {
      mediaQueryListByQueryString[query] = mql = matchMedia(query);
    }

    if (!listenersByQuery || !listenersByQuery[query]) {
      const listener = () => setState(query, mql.matches, '_all');
      mql.addListener(listener);

      listenersByQuery[query] = {
        remove() {
          mql.removeListener(listener);
        }
      };
    }

    // Apply media query states
    if (mql.matches) {
      newStyle = mergeStyles([newStyle, nestedRules]);
    }
  });

  // Remove media queries
  newStyle = Object.keys(newStyle).reduce(
    (styleWithoutMedia, key) => {
      if (key.indexOf('@media') !== 0) {
        styleWithoutMedia[key] = newStyle[key];
      }
      return styleWithoutMedia;
    },
    {}
  );

  return {
    componentFields: newComponentFields,
    globalState: {mediaQueryListByQueryString},
    props: newProps,
    style: newStyle
  };
}
