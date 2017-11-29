/**
 * Update the files in `src/prefix-data` to match the `browserList` below. Run
 * this if browser support changes or `inline-style-prefixer` gets fixes for the
 * supported browsers.
 */
import path from 'path';
import generateData from 'inline-style-prefixer/generator';

const browserList = {
  chrome: 30,
  android: 4,
  firefox: 25,
  ios_saf: 6,
  safari: 6,
  ie: 9,
  ie_mob: 9,
  edge: 12,
  opera: 13,
  op_mini: 5,
  and_uc: 9,
  and_chr: 30
};

generateData(browserList, {
  staticPath: path.join(__dirname, '../src/prefix-data/static.js'),
  dynamicPath: path.join(__dirname, '../src/prefix-data/dynamic.js')
});
