var checkPropsPlugin = require('./check-props-plugin');
var mergeStyleArrayPlugin = require('./merge-style-array-plugin');
var prefixPlugin = require('./prefix-plugin');
var resolveInteractionStylesPlugin = require('./resolve-interaction-styles-plugin');
var resolveMediaQueriesPlugin = require('./resolve-media-queries-plugin');

module.exports = {
	checkProps: checkPropsPlugin,
	mergeStyleArray: mergeStyleArrayPlugin,
	prefix: prefixPlugin,
	resolveInteractionStyles: resolveInteractionStylesPlugin,
	resolveMediaQueries: resolveMediaQueriesPlugin
};
