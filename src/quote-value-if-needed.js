const quotedProperties = ['content'];

export default function quoteValueIfNeeded(property, value) {
  return (quotedProperties.indexOf(property) >= 0) ? `"${value}"` : value;
}
