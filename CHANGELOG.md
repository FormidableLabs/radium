# Radium Changelog

## 0.18.4 (May 15, 2017)
- Reverts PropTypes-related diff, which should have been a minor version instead
    of a patch

## 0.18.3 (May 15, 2017)
- Update dependencies
- Update deprecated React syntax in examples
- Use React "prop-types" package

## 0.18.2 (March 15, 2017)

### Improvements
- Update `inline-style-prefixer` to v2.0.5 (#880).
- Use `React.PureComponent` to avoid unnecessary rendering (#868).
- Update all dependencies

## 0.18.1 (July 19, 2016)

### Bug Fixes
- Fix unused props warning when passing `radiumConfig` to `StyleRoot` (#787).

## 0.18.0 (July 15, 2016)

### Breaking Changes
- Revert `content` auto-quoting in `Style` component (#783).

### Bug Fixes
- Silence React 15.2 unused props deprecation warning (#782).

## 0.17.2 (July 12, 2016)

### Bug Fixes
- Fix `content` values in `Style` component (#719).
- Improve stateless component check to work with native arrow functions (#771).

### Improvements
- Add support for `:disabled` pseudo-class (#689).
- Add plugin to remove nested style objects and prevent `[Object object]` from rendering in the DOM (#703).

## 0.17.1 (March 30, 2016)

### Bug Fixes
- Remove babel modules accidentally published as dependencies.

### Improvements
- Add support for `scopeSelector` without nested selectors in `Style` component.

## 0.17.0 (March 24, 2016)

### Bug Fixes
- Upgrade `inline-style-prefixer` to version `1.0.3` with a fix for `display` values being removed in IE10.

### Improvements
- Add `TestMode` for controlling internal Radium state and behavior during tests.

### Breaking Changes
- `inline-style-prefixer` has updated vendor prefixes, removing some outdated prefixes like `-moz-transform`.

## 0.16.6 (February 9, 2016)

### Bug Fixes
- The `lib/` directory did not get built property in 0.16.6. `lib/` now contains all changes from 0.16.5.

## 0.16.5 (January 27, 2016)

### Bug Fixes
- Don't merge media query styles, fixes #550
- Don't add className if empty, fixes #539

### Improvements
- Passing `'all'` as the `userAgent` will add all prefixes, useful for caching server-rendered pages, thanks @oliviertassinari (this applies to inline styles and style rendered as CSS, but does not yet include adding all the prefixed versions of `keyframes`)
- Add support for `:visited` styles:
```jsx
const url = 'https://github.com/formidablelabs/radium';
const VisitedLink = Radium(() =>
  <a href={url} style={{color: 'gray', ':visited': {color: 'black'}}}>{url}</a>
);
```

## 0.16.4 (January 23, 2016)

### Bug Fixes
- Add `px` suffix if needed *before* prefixing, since the list in `appendPxIfNeeded` does not include prefixed variants
- Radium now calls `toString` on values itself, instead of relying on `inline-style-prefixer` or React to do so (they don't)

### Improvements
- Much lighter `npm install radium` by removing `babel` & co from `dependencies` before publishing
- Radium now ignores children or props that are themselves Radium enhanced components, for a nice perf gain. Thanks @spacenick

## 0.16.3 (January 21, 2016)
- Published under the `test` tag, so not installable via npm latest
- Forgot to add `-test` to the version
- See changelog for 0.16.4 instead

## 0.16.2 (January 8, 2016)

### Bug Fixes
- `<StyleSheet/> Component:`
  - Bind the private method _onChange to the class instance
  - Wrap setState in setTimeout and keep track of isMounted, #500
  - Remove duplicate declaration of componentWillUnmount and move `this._isMounted = true` inside `componentDidMount`
- Clear up docs around StyleRoot props, clear up issues in #496
- Properly prefix keyframes: Use `inline-style-prefixer`’s `prefixedKeyframes`, #488
- Ensure unique classname is generated for media query rules (hash on query _and_ ruleCSS string)

## 0.16.1 (January 5, 2016)

### Bug Fixes
- `<StyleRoot>` no longer throws an error on unmount

## 0.16.0 (January 5, 2016)

### New Features
- Server-side rendering for media queries and keyframes!

### Breaking Changes
- To use keyframes and media queries, you must wrap your components in the `<StyleRoot>` component, typically in `<App>`: https://github.com/FormidableLabs/radium/tree/master/docs/api#styleroot-component
- The result of Radium.keyframes is the animation name, and should be assigned to the `animationName` prop: https://github.com/FormidableLabs/radium/tree/master/docs/api#keyframes
- printStyles have been removed, in favor of '@media print' media queries, which are now rendered as CSS so they work correctly: https://github.com/FormidableLabs/radium/tree/master/docs/guides#media-queries

### Bug Fixes
- Don't add extra media query listeners
- Append px to numeric values on properties that don't accept unitless values

### Improvements
- Upgrade `inline-style-prefixer` to version 0.6.2 (Edge support)
- Better error on duplicate keys
- Upgrade to Babel 6
- `<Style>` adds the `scopeSelector` to comma separated selectors
- `<Style>` now accepts `radiumConfig` directly with the `userAgent` field

## 0.15.3 (November 16, 2015)

### Bug Fixes

- Fix `"files"` section in `package.json`, should fix `npm install issues`

## 0.15.2 (November 15, 2015)

### Bug Fixes

- IE vender prefix (ms) is now converted to dash-case correctly (-ms), thanks @PallasKatze, fixes #413
- Super getChildContext is no longer ignored, thanks @richardfickling, fixes #412
- Update to inline-style-prefixer v0.5.1 and changed the userAgent error to a console.warning

## 0.15.1 (November 11, 2015)

### Bug Fixes

- Fix bug where active styles on multiple elements in the same component were not being removed on mouse up, fixes #410

## 0.15.0 (November 11, 2015)

### New Features

- Radium now uses [inline-style-prefixer](https://github.com/rofrischmann/inline-style-prefixer) to do all prefixing. Because `inline-style-prefixer` relies on the userAgent (similar to autoprefixer), it produces the same prefixes on both the client and the server. This is a huge step in making Radium truly universal (see [example](https://github.com/FormidableLabs/radium/blob/master/examples/server.js)). Thanks much to @rofrischmann for putting up with my API suggestions and requests!
- Any Radium component can also be configured at render time via a [`radiumConfig`](https://github.com/FormidableLabs/radium/blob/master/docs/api/README.md#radium). This was mainly required for passing the `userAgent` during a server-side render.

### Breaking Changes

- Style component no longer supports the `prefix` prop. It automatically gets the correct userAgent to pass to the prefixer from `radiumConfig` context

### Bug Fixes

- Radium wrapper now replaces the `style` propType, if defined, with array or object, fixing #396
- Stateless components now support context, thanks @ThomWright
- Static fields on stateless components are now transferred to the Radium wrapper (`defualtProps`, `propTypes`, etc)

### Improvements

- Code has been ES2015-ified: const and let, import/export, fat arrows,
- Code has moved from `modules` to `src`

## 0.14.3 (October 19, 2015)

### Bug Fixes

- camelCasePropsToDashCase handles uppercase first character correctly, fixing #387

## 0.14.2 (October 17, 2015)

### Bug Fixes

- `:active` styles now triggered by space or enter
- Callback `ref`s are now ignored, fixing #346
- Heavy use of media queries no longer causes setState on an unmounted component, fixing #382

### New Features

- Stateless components (function taking props) are now supported

### Improvements

- Updated examples to for React 0.14.0
- Allow replacing the prefixer used by `Radium.keyframes` and `<Style>`

## 0.14.1 (September 15, 2015)

### Bug Fixes

- Don't require object-assign, which wasn't in normal dependencies

## 0.14.0 (September 15, 2015)

### Breaking Changes

- `Config.setMatchMedia` has been replaced by the `matchMedia` field in the config passed to `@Radium` ([see documentation](https://github.com/FormidableLabs/radium/tree/master/docs/api#configmatchmedia))

### New Features

- Plugin system, via the config passed to `@Radium` (see docs for [`config.plugins`](https://github.com/FormidableLabs/radium/tree/master/docs/api#configplugins) and the [plugin API](https://github.com/FormidableLabs/radium/tree/master/docs/api#plugins))

### Improvements

- Flatten nested arrays in `style`, #344, thanks @almost
- Universal/isomorphic example `npm run universal`, thanks @jurgob and @moret

### Bug Fixes

- Static properties are now copied again in IE < 10, #349, thanks @bobbyrenwick

## 0.13.8 (August 24, 2015)

### Bug Fixes

- Fix static class methods disappearing in IE10, #313
- Fix bug when using spread operator to pass props to a DOM element, #322

## 0.13.7 (August 5, 2015)

### Bug Fixes

- Fix double resolving bug on props.children, #307

## 0.13.6 (August 5, 2015)

### New Features

- Resolve styles on elements found in props and children as function, #298
- [&lt;PrintStyleSheet&gt;](https://github.com/FormidableLabs/radium/tree/master/docs/api#printstylesheet-component) component and `printStyles` property to add print styles to your components, #299, thanks @bobbyrenwick

### Improvements

- Show component name when warning in prefixer, #302, thanks @AnSavvides

### Bug Fixes

- Fix bug with _radiumDidResolveStyles that was breaking in React 0.14.0-beta2
- Un-prefix values before checking isUnitlessNumber, #305, thanks @AnSavvides
- Prevent errors from getters that do not have setters as static props of React components, #306, thanks @rolandpoulter

## 0.13.5 (July 29, 2015)

### Improvements

- Support for old and tweener flexbox syntax, #279, thanks @sylvaingi
- Only calls console.warn during development, not in production

### Bug Fixes

- Don't call resolveStyles more than once on the same element, #293
- Allow null or undefined values in style, #263
- Remove redundant babel-core from dependencies
- Fix using numeric 0 as key to getState, #275
- Don't wrap display name with "Radium(...)", #271
- Fix older firefox missing `float` property, #277, thanks @bencao
- Don't warn when mixing `transform` properties, #272, thanks @MattHauglustaine
- Use for loop instead of Array prototype on the result of window.getComputedStyle, which was breaking Android web view, #267, thanks @bsbeeks
- Ignore functions as children instead of blowing up, #265, thanks @Cottin

### Misc

- Add `test-dev` command for faster test feedback during development

## 0.13.4 (July 14, 2015)

### Bug Fixes

- Fix regression with multiple states (tests were failing) from 0.13.3

## 0.13.3 (July 13, 2015)

### Bug Fixes

- Fix hotloading component methods, #255, thanks @bobbyrenwick
- Add displayName to shorthand warning, #253, thanks @bobbyrenwick
- Warn and ignore null/undefined values, #250, thanks @AnSavvides
- Don't warn when mixing border & borderRadius, and more shorthand warning updates, #246, thanks @nathanfriemel
- Remove react from peerDependencies so Radium can be used with the 0.14 beta, #242, thanks @dariocravero
- Fix transfering defaultProps and friends in IE <11, #241, thanks @bobbyrenwick
- Don't alias matchMedia, fixes IE <11 bug, #238
- Stop mutating style state, #237

### Misc

- Migrate tests to Karma, #240, thanks @exogen

## 0.13.2 (June 25, 2015)

### Bug Fixes

- Use `console.warn` instead of `console.warning` (duh)

## 0.13.1 (June 24, 2015)

### New Features

- [Radium.Config.setMatchMedia](https://github.com/FormidableLabs/radium/tree/master/docs/api#configsetmatchmedia) for server rendering

### Bug Fixes

- Don't resolve `style` prop of custom components, e.g. `<MyComponent style={...} />`, #202 (thanks @azazdeaz)
- Fix not using dash-case on server with Style, #207
- Fix server rendering when using fallback array of values (uses first one)
- Fix numeric fallbacks, #221

### Misc

- Update dependencies
- Warn when mixing longhand and shorthand

## 0.13.0 (June 7, 2015)

### Breaking Changes

- `Radium.wrap` and `Radium.Enhancer` have been merged and moved to `Radium()`. Just wrap your component, `Button = Radium(Button);`, or use the decorator `@Radium`
- `Style` component `rules` prop now takes an object instead of an array

### New Features

- Support fallback values (e.g. `#fff` for `rgba(...)`)

### Bug Fixes

- Fix react external in webpack config
- Fix keyframes throwing on IE9 (now does feature detection)
- Fix windows build
- `string` and `number` children are no longer wrapped in an extraneous `<span>`

## 0.12.2 (May 22, 2015)

### Breaking Changes

None

### New Features

- Support prefixing for old flexbox implementations

### Bug Fixes

- Stop using react internals `CSSPropertyOperations.createMarkupForStyles`, which further reduces the build size

## 0.12.1 (May 22, 2015)

### Bug Fixes

- Fix Enhancer (displayName, etc) #165
- Reduce size of distributed build
- Tests for prefixing, fix #161

## 0.12.0 (May 16, 2015)

### New Features

- Support for ES6 classes with Radium.Enhancer
- Vendor-prefixing
- Keyframes animation helper
- Radium.getState API

### Bug Fixes

- Fix errors during server-side rendering #141
- Fix passing a single child or string #139

## 0.11.1 (April 28, 2015)

### Bug Fixes

- Checked in updated `dist` files from `0.11.0`. Whoops!

## 0.11.0 (April 28, 2015)

### Breaking Changes

- Complete API rewrite.
  - Added new "Wrap" API.
  - Wrap React component config with `Radium.wrap()` to automatically add
    browser state handlers, media query behavior, and array-based style
    resolution.
- Removed all mixins.
- Removed context-based media query behavior.
  - Replaced with global media query handler.
- Removed modifiers, states, and media queries from style objects.
  - Replaced `modifiers` with array-based `style` prop resolution.
  - Replaced `states` object with inline state keys: `:hover`
  - Replaced `mediaQueries` object with inline queries:
    `@media (min-width: 200px)`

### New Features

- Apply separate browser state styles to multiple elements in the same
  component.
