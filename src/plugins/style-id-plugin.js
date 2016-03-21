/** @flow */

import type {PluginConfig, PluginResult} from './index';
import uuid from 'node-uuid';

export default function styleIDPlugin({
  props
}: PluginConfig): PluginResult {
  if (!props.styleID) {
    return {
      props: {styleID: uuid.v4()}
    };
  }
}
