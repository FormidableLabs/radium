/* @flow */

export default function mapObject<TValue, TNext>(
  object: {[key: string]: TValue},
  mapper: (value: TValue, key: string) => TNext
): {[key: string]: TNext} {
  return Object.keys(object).reduce((result, key) => {
    result[key] = mapper(object[key], key);
    return result;
  }, {});
}
