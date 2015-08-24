Thanks for contributing!

## Development

Run `npm run examples` to run a webpack dev server with Radium examples.

## Lint

Run `npm run lint` before committing to lint files.

## Flow

1. [Install flow](http://flowtype.org/docs/getting-started.html#installing-flow)
2. Run `flow` to check for missing annotations and static type check failures

## Dist

Please do not commit changes to files in `dist`. These files are only committed when we tag releases.

## Releasing a new version to NPM

Only for project administrators:

1. Update `CHANGELOG.md`, following format for previous versions
2. Run `npm run dist` to generate the dist builds
3. Commit as "Prepare for version 0.XX.Y"
4. Run `npm version patch` to update `package.json` and add a tag
5. Run `npm publish` to run tests and lint, build the `lib` directory, and publish to NPM if all is well
6. Run `git push && git push --tags`
