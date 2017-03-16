/* @flow */

// a simple djb2 hash based on hash-string:
// https://github.com/MatthewBarker/hash-string/blob/master/source/hash-string.js
// returns a hex-encoded hash
export default function hash(text: string): string {
  if (!text) {
    return '';
  }

  let hashValue = 5381;
  let index = text.length - 1;

  while (index) {
    hashValue = hashValue * 33 ^ text.charCodeAt(index);
    index -= 1;
  }

  return (hashValue >>> 0).toString(16);
}
