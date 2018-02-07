/**
 * Add `module.exports` default like old babel5 did.
 *
 * This plugin is based off
 * https://github.com/59naga/babel-plugin-add-module-exports
 * with the tweak that named exports are allowed, as long as they come **after**
 * the default export, so that the ES5 version is still valid. This plugin
 * will generate an error if any named exports come first.
 *
 * @param {Object} babel The babel object, yo.
 * @returns {void}
 */
module.exports = babel => ({
  visitor: {
    Program: {
      exit: path => {
        // Skip if we've already been here.
        if (path.BABEL_PLUGIN_RADIUM_ADD_LEGACY_MODULE_EXPORTS) {
          return;
        }

        let hasExportDefault = false;
        let hasExportNamed = false;
        const visitedExportDefault = () => {
          // Validation
          if (hasExportNamed) {
            throw new Error('Encountered named exports before default');
          }
          if (hasExportDefault) {
            throw new Error('Encountered multiple default exports');
          }
          hasExportDefault = true;
        };

        path.get('body').forEach(p => {
          if (p.isExportDefaultDeclaration()) {
            visitedExportDefault();
          }

          if (p.isExportNamedDeclaration()) {
            if (
              p.node.specifiers.length === 1 &&
              p.node.specifiers[0].exported.name === 'default'
            ) {
              visitedExportDefault();
            } else {
              hasExportNamed = true;
            }
          }
        });

        if (hasExportDefault) {
          const types = babel.types;
          path.pushContainer('body', [
            types.expressionStatement(
              types.assignmentExpression(
                '=',
                types.memberExpression(
                  types.identifier('module'),
                  types.identifier('exports')
                ),
                types.memberExpression(
                  types.identifier('exports'),
                  types.stringLiteral('default'),
                  true
                )
              )
            )
          ]);
        }

        // Mark visited.
        path.BABEL_PLUGIN_RADIUM_ADD_LEGACY_MODULE_EXPORTS = true;
      }
    }
  }
});
