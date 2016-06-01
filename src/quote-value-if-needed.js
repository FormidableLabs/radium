/* @flow */

const quotedProperties = ['content'];

export default function quoteValueIfNeeded(property: string, value: any): string {
  return (quotedProperties.indexOf(property) >= 0) ? `"${value}"` : value;
}
