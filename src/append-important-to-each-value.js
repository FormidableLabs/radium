export default function appendImportantToEachValue(style) {
  return Object.keys(style).reduce((result, key) => {
    // This breaks unitless values but they'll be deprecated soon anyway
    // https://github.com/facebook/react/issues/1873
    result[key] = style[key] + '!important';
    return result;
  }, {});
}
