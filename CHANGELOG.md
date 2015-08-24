# Radium Changelog

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
