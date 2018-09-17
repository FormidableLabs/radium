[![Travis Status][trav_img]][trav_site]
[![AppVeyor Status][appveyor_img]][appveyor_site]
[![Coverage Status][cov_img]][cov_site]
[![NPM Package][npm_img]][npm_site]
[![Dependency Status][david_img]][david_site]
![gzipped size][size_img]

# Radium

```
npm install radium
```

Radium is a set of tools to manage inline styles on React elements. It gives you powerful styling capabilities without CSS.

_Inspired by_ <a href="https://speakerdeck.com/vjeux/react-css-in-js">React: CSS in JS</a>
by <a href="https://twitter.com/Vjeux">vjeux</a>.

## Overview

Eliminating CSS in favor of inline styles that are computed on the fly is a powerful approach, providing a number of benefits over traditional CSS:

- Scoped styles without selectors
- Avoids specificity conflicts
- Source order independence
- Dead code elimination
- Highly expressive

Despite that, there are some common CSS features and techniques that inline styles don't easily accommodate: media queries, browser states (:hover, :focus, :active) and modifiers (no more .btn-primary!). Radium offers a standard interface and abstractions for dealing with these problems.

When we say expressive, we mean it: math, concatenation, regex, conditionals, functions–JavaScript is at your disposal. Modern web applications demand that the display changes when data changes, and Radium is here to help.

For a short technical explanation, see [How does Radium work?](#how-does-radium-work).

## Features

* Conceptually simple extension of normal inline styles
* Browser state styles to support `:hover`, `:focus`, and `:active`
* Media queries
* Automatic vendor prefixing
* Keyframes animation helper
* ES6 class and `createClass` support

## Docs

- [Overview][docs_guides]
- [API Docs][docs_api]
- [Frequently Asked Questions (FAQ)][docs_faq]

## Usage

Start by wrapping your component class with `Radium()`, like `export default Radium(Component)`, or `Component = Radium(Component)`, which works with classes, `createClass`, and stateless components (functions that take props and return a ReactElement). Then, write a style object as you normally would with inline styles, and add in styles for interactive states and media queries. Pass the style object to your component via `style={...}` and let Radium do the rest!

```jsx
<Button kind="primary">Radium Button</Button>
```

```jsx
import Radium from 'radium';
import React from 'react';
import color from 'color';

class Button extends React.Component {
  static propTypes = {
    kind: PropTypes.oneOf(['primary', 'warning']).isRequired
  };

  render() {
    // Radium extends the style attribute to accept an array. It will merge
    // the styles in order. We use this feature here to apply the primary
    // or warning styles depending on the value of the `kind` prop. Since its
    // all just JavaScript, you can use whatever logic you want to decide which
    // styles are applied (props, state, context, etc).
    return (
      <button
        style={[
          styles.base,
          styles[this.props.kind]
        ]}>
        {this.props.children}
      </button>
    );
  }
}

Button = Radium(Button);

// You can create your style objects dynamically or share them for
// every instance of the component.
var styles = {
  base: {
    color: '#fff',

    // Adding interactive state couldn't be easier! Add a special key to your
    // style object (:hover, :focus, :active, or @media) with the additional rules.
    ':hover': {
      background: color('#0074d9').lighten(0.2).hexString()
    }
  },

  primary: {
    background: '#0074D9'
  },

  warning: {
    background: '#FF4136'
  }
};
```

## Importing Radium

As of `v0.22.x`, Radium is built as an ECMAScript Modules-first project. We now have a `package.json:module` entry pointing to our library files with `import|export` statements instead of CommonJS `require`s. We still support CommonJS `require`s with a special `package.json:main` entry pointing to root `index.js` to smooth over this transition. The basic takeaways are:

If you are using **ESM** with **webpack** or **`@std/esm`** with **Node.js**, imports like the following work fine without any gotchas:

```js
import Radium from 'radium';
import Radium, { Style } from 'radium';
```

If you are using **CommonJS** with **Node.js** or **webpack@1** requires work like normal:

```js
const Radium = require('radium');
const { Style } = require('radium');
```

If you are using **CommonJS** with **webpack@2+**, however, you must instead add `.default` to the root `Radium` object import:

```js
const Radium = require('radium').default; // CHANGED: Must add `.default`
const { Style } = require('radium');      // Works as per normal
```

If you cannot change the `require` statements directly (say Radium is included from a different library your project depends on) you can manually tweak the Radium import in your project's webpack configuration with the following:

```js
resolve: {
  alias: {
    radium: require.resolve("radium/index")
  }
}
```

which will allow `const Radium = require('radium');` to still work. The configuration effectively forces webpack to point to code from `package.json:main` (which points to `/index.js`) instead of what is in `package.json:module`.

*Note:* Radium uses `Reflect` which is not supported in IE11. You will need to bring in a polyfill like [CoreJs](https://github.com/zloirock/core-js#ecmascript-reflect) in order to support <IE11.

## Examples

To see the universal examples:

```
npm install
npm run universal
```

To see local client-side only examples in action, do this:

```
npm install
npm run examples
```

## How does Radium work?

Following is a short technical explanation of Radium's inner workings:

- Wrap the `render` function
- Recurse into the result of the original `render`
- For each element:
  - Add handlers to props if interactive styles are specified, e.g. `onMouseEnter` for `:hover`, wrapping existing handlers if necessary
  - If any of the handlers are triggered, e.g. by hovering, Radium calls `setState` to update a Radium-specific field on the components state object
  - On re-render, resolve any interactive styles that apply, e.g. `:hover`, by looking up the element's key or ref in the Radium-specific state

## More with Radium

You can find a list of other tools, components, and frameworks to help you build with Radium on our [wiki](https://github.com/FormidableLabs/radium/wiki). Contributions welcome!

## Contributing

Please see [CONTRIBUTING](https://github.com/FormidableLabs/radium/blob/master/CONTRIBUTING.md)

[trav_img]: https://api.travis-ci.org/FormidableLabs/radium.svg
[trav_site]: https://travis-ci.org/FormidableLabs/radium
[cov_img]: https://img.shields.io/coveralls/FormidableLabs/radium.svg
[cov_site]: https://coveralls.io/r/FormidableLabs/radium
[npm_img]: https://img.shields.io/npm/v/radium.svg
[npm_site]: https://www.npmjs.org/package/radium
[david_img]: https://img.shields.io/david/FormidableLabs/radium.svg
[david_site]: https://david-dm.org/FormidableLabs/radium
[size_img]: https://badges.herokuapp.com/size/npm/radium/dist/radium.min.js?gzip=true&label=gzipped
[docs_guides]: https://github.com/FormidableLabs/radium/tree/master/docs/guides
[docs_api]: https://github.com/FormidableLabs/radium/tree/master/docs/api
[docs_faq]: https://github.com/FormidableLabs/radium/tree/master/docs/faq
[appveyor_img]: https://ci.appveyor.com/api/projects/status/github/formidablelabs/radium?branch=master&svg=true
[appveyor_site]: https://ci.appveyor.com/project/ryan-roemer/radium
