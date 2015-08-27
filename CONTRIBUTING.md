Thanks for contributing!

## Development

### Installing dependencies

```bash
npm install
```

You will find all building blocks that make up Radium in the [`modules`](modules) folder.

### Testing

You will find tests for each module inside [`modules/__tests__`](modules/__tests__). Whenever making any changes, ensure that all existing tests pass by running `npm run test`. You can also have [`Karma`](http://karma-runner.github.io/) running in the background and run your tests every time you make a change by doing `npm run test-dev`.

If you are adding a new feature or some extra functionality, you should also make sure to accompany those changes with appropriate tests.

### Linting

Before commiting any changes, be sure to do `npm run lint`; this will lint all relevant files using [ESLint](http://eslint.org/) and report on any changes that you need to make.

### Flow

- [Install flow](http://flowtype.org/docs/getting-started.html#installing-flow)
- Run `flow` to check for missing annotations and static type check failures

### Examples

You can run examples locally by simply doing `npm run examples`; this will start a webpack dev server (the config file is found at [examples/webpack.config.js](examples/webpack.config.js)) making Radium examples available at `http://localhost:8080`.

Please note that if you use `npm run test-dev` as above, Karma will use port `8080`. You can change the port used by the examples by running `npm run examples -- --port 8000`.

### Before submitting a PR...

Thanks for taking the time to help us make Radium even better! Before you go ahead and submit a PR, make sure that you have done the following:
- Run the tests (you did add tests, right?) using `npm run test-dev`.
- Run lint using `npm run lint`
- Run flow using `flow`

## Dist

Please do not commit changes to files in `dist`. These files are only committed when we tag releases.

## Releasing a new version to NPM (only for project administrators):

1. Update `CHANGELOG.md`, following format for previous versions
2. Run `npm run dist` to generate the dist builds
3. Commit as "Prepare for version 0.XX.Y"
4. Run `npm version patch` to update `package.json` and add a tag
5. Run `npm publish` to run tests and lint, build the `lib` directory, and publish to NPM if all is well
6. Run `git push && git push --tags`
