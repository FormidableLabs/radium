/* @flow */

import appendPxIfNeeded from './append-px-if-needed';
import mapObject from './map-object';

export default function appendImportantToEachValue(style: Object): Object {
  return mapObject(
    style,
    (result, key) => appendPxIfNeeded(key, style[key]) + ' !important',
  );
}
