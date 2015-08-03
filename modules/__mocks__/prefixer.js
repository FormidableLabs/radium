var nextPrefixedPropertyName = null;

module.exports = {
  getPrefixedPropertyName: name => {
    if (nextPrefixedPropertyName !== null) {
      name = nextPrefixedPropertyName;
      nextPrefixedPropertyName = null;
    }
    return name;
  },
  getPrefixedStyle: (component, style) => (component, style),
  cssPrefix: '-webkit-',

  __setNextPrefixedPropertyName (name) {
    nextPrefixedPropertyName = name;
  }
};
