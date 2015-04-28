# Radium Changelog

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
