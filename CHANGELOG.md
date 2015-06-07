# Radium Changelog

## 0.13.0 (June 7, 2015)

### Breaking changes

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
