# Radium API

**Table of Contents**

- [Sample Style Object](#sample-style-object)
- [Radium](#radium)
  - [config.matchMedia](#configmatchmedia)
  - [config.plugins](#configplugins)
  - [config.userAgent](#configuseragent)
- [getState](#getstate)
- [keyframes](#keyframes)
- [Plugins](#plugins)
- [Style Component](#style-component)
- [StyleRoot Component](#styleroot-component)
- [TestMode](#testmode)


## Sample Style Object

```jsx
var styles = {
  base: {
    backgroundColor: '#0074d9',
    border: 0,
    borderRadius: '0.3em',
    color: '#fff',
    cursor: 'pointer',
    fontSize: 16,
    outline: 'none',
    padding: '0.4em 1em',

    ':hover': {
      backgroundColor: '#0088FF'
    },

    ':focus': {
      backgroundColor: '#0088FF'
    },

    ':active': {
      backgroundColor: '#005299',
      transform: 'translateY(2px)',
    },

    // Media queries must start with @media, and follow the same syntax as CSS
    '@media (min-width: 992px)': {
      padding: '0.6em 1.2em'
    },

    '@media (min-width: 1200px)': {
      padding: '0.8em 1.5em',

      // Media queries can also have nested :hover, :focus, or :active states
      ':hover': {
        backgroundColor: '#329FFF'
      }
    }
  },

  red: {
    backgroundColor: '#d90000',

    ':hover': {
      backgroundColor: '#FF0000'
    },

    ':focus': {
      backgroundColor: '#FF0000'
    },

    ':active': {
      backgroundColor: '#990000'
    }
  }
};
```

## Radium

`Radium` itself is a higher-order component, whose job is to:
- Provide initial state
- Process the `style` attribute after `render()`
- Clean up any resources when the component unmounts

Usage with `class`:

```jsx
class MyComponent extends React.Component { ... }

MyComponent = Radium(MyComponent);
```

Usage with `createClass`:

```jsx
var MyComponent = React.createClass({ ... });
export default Radium(MyComponent);
```

`Radium`'s primary job is to apply interactive or media query styles, but even if you are not using any special styles, the higher order component will still:
- Merge arrays of styles passed as the `style` attribute
- Automatically vendor prefix the `style` object

You can also pass a configuration object to `Radium`:

```jsx
class MyComponent extends React.Component { ... }

MyComponent = Radium({matchMedia: mockMatchMedia})(MyComponent);

// or with createClass

var MyComponent = React.createClass({ ... });
module.exports = Radium({matchMedia: mockMatchMedia})(MyComponent);
```

You may want to have project-wide Radium settings. Simply create a function that
wraps Radium, and use it instead of `Radium`:

```jsx
function ConfiguredRadium(component) {
  return Radium(config)(component);
}

// Usage
class MyComponent extends React.Component { ... }

MyComponent = ConfiguredRadium(MyComponent);
```

Radium can be called any number of times with a config object, and later configs
will be merged with and overwrite previous configs. That way, you can still
override settings on a per-component basis:

```jsx
class MySpecialComponent extends React.Component { ... }

MySpecialComponent = ConfiguredRadium(config)(MySpecialComponent);
```

Alternatively, if the config value can change every time the component is rendered (userAgent, for example), you can pass configuration to any component wrapped in `Radium` using the `radiumConfig` prop:

```jsx
<App radiumConfig={{userAgent: req.headers['user-agent']}} />
```

The config will be passed down via [context](https://facebook.github.io/react/docs/context.html) to all child components. Fields in the `radiumConfig` prop or context will override those passed into the `Radium()` function.

Possible configuration values:
- [`matchMedia`](#configmatchmedia)
- [`plugins`](#configplugins)
- [`userAgent`](#configuseragent)

### config.matchMedia

Allows you to replace the `matchMedia` function that Radium uses. The default is `window.matchMedia`, and the primary use case for replacing it is to use media queries on the server. You'll have to send the width and height of the page to the server somehow, and then use a [mock for match media](https://github.com/azazdeaz/match-media-mock) that implements the [`window.matchMedia` API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia). Your code could look like this:

**Server**

You can require `Radium` on the server / using CommonJS with:

```jsx
var Radium = require('radium');
```

```jsx
var ConfiguredRadium = require('./configured-radium');
var matchMediaMock = require('match-media-mock').create();
ConfiguredRadium.setMatchMedia(matchMediaMock);

app.get('/app/:width/:height', function(req, res) {
  matchMediaMock.setConfig({
    type: 'screen',
    width: req.params.width,
    height: req.params.height,
  });

  // Your application code uses `ConfiguredRadium` instead of `Radium`
  var html = React.renderToString(<RadiumApp />);

  res.end(html);
});
```

**ConfiguredRadium.js**

```jsx
var Radium = require('radium');

var _matchMedia = null;

function ConfiguredRadium(component) {
  return Radium({
    matchMedia: _matchMedia
  })(component);
}

ConfiguredRadium.setMatchMedia = function (matchMedia) {
  _matchMedia = matchMedia;
};

module.exports = ConfiguredRadium;
```

**MyComponent.js**

```jsx
var ConfiguredRadium = require('./configured-radium');

class MyComponent extends React.Component { ... }

MyComponent = ConfiguredRadium(MyComponent);
```

See [#146](https://github.com/FormidableLabs/radium/pull/146) for more info.

### config.plugins
**Array&lt;Plugin&gt;**

Replaces all plugins with the provided set. See [Plugins](#plugins) for more information.

Because the `plugins` config replaces all plugins, you have to provide the built-ins if you want to keep the default Radium functionality. A simple example of creating and adding a `styleLogger` plugin:

```jsx
function styleLogger({componentName, style}) {
  console.log('Name: ' + componentName, style);
}

function ConfiguredRadium(component) {
  return Radium({
    plugins: [
      Radium.Plugins.mergeStyleArray,
      Radium.Plugins.checkProps,
      Radium.Plugins.resolveMediaQueries,
      Radium.Plugins.resolveInteractionStyles,
      Radium.Plugins.keyframes,
      Radium.Plugins.visited,
      Radium.Plugins.removeNestedStyles,
      Radium.Plugins.prefix,
      styleLogger,
      Radium.Plugins.checkProps,
    ],
  })(component);
}

// Usage
class MyComponent extends React.Component { ... }

MyComponent = ConfiguredRadium(MyComponent);
```

You will typically want to put plugins before the final `checkProps` so that you can still benefit from the checks it provides. If your plugin might produce other pseudo-style blocks, like `@media` consumed by `resolveMediaQueries` or `:hover` consumed by `resolveInteractionStyles`, you would want to have your plugin run before those plugins.

You can of course omit any or all of the built-in plugins, and replace them with your own version. For example, you may want to omit `Radium.Plugins.prefix` entirely if you aren't using vendor prefixes or are using a [compile-time solution](https://github.com/UXtemple/babel-plugin-react-autoprefix) instead.

### config.userAgent
**string**

Set the user agent passed to [inline-style-prefixer](https://github.com/rofrischmann/inline-style-prefixer) to perform prefixing on style objects. Mainly used during server rendering, passed in via the `radiumConfig` prop. Using express:

```jsx
<App radiumConfig={{userAgent: req.headers['user-agent']}} />
```

For a complete example, see [examples/server.js](https://github.com/FormidableLabs/radium/blob/master/examples/server.js).

## getState

**Radium.getState(state, elementKey, value)**

_Note: `getState` will not work in a stateless component, because even though Radium maintains the state internally, the stateless component does not have access to it, by definition_

Query Radium's knowledge of the browser state for a given element key. This is particularly useful if you would like to set styles for one element when another element is in a particular state, e.g. show a message when a button is hovered.

Note that the target element specified by `elementKey` must have the state you'd like to check defined in its style object so that Radium knows to add the handlers. It can be empty, e.g. `':hover': {}`.

Parameters:

- **state** - you'll usually pass `this.state`, but sometimes you may want to pass a previous state, like in `shouldComponentUpdate`, `componentWillUpdate`, and `componentDidUpdate`
- **elementKey** - if you used multiple elements, pass the same `key=""` or `ref=""`. If you only have one element, you can leave it blank (`'main'` will be inferred)
- **value** - one of the following: `:active`, `:focus`, and `:hover`
- **returns** `true` or `false`

Usage:

```jsx
Radium.getState(this.state, 'button', ':hover')
```

## keyframes

**Radium.keyframes(keyframes, [name])**

Create a keyframes animation for use in an inline style. `keyframes` returns an opaque object you must assign to the `animationName` property. `Plugins.keyframes` detects the object and adds CSS to the Radium root's style sheet. Radium will automatically apply vendor prefixing to keyframe styles. In order to use `keyframes`, you must wrap your application in the [`StyleRoot component`](#styleroot-component).

`keyframes` takes an optional second parameter, a `name` to prepend to the animation's name to aid in debugging.

```jsx
class Spinner extends React.Component {
  render () {
    return (
      <div>
        <div style={styles.inner} />
      </div>
    );
  }
}

Spinner = Radium(Spinner);

var pulseKeyframes = Radium.keyframes({
  '0%': {width: '10%'},
  '50%': {width: '50%'},
  '100%': {width: '10%'},
}, 'pulse');

var styles = {
  inner: {
    // Use a placeholder animation name in `animation`
    animation: 'x 3s ease 0s infinite',
    // Assign the result of `keyframes` to `animationName`
    animationName: pulseKeyframes,
    background: 'blue',
    height: '4px',
    margin: '0 auto',
  }
};
```

Multiple keyframe animations can be chained together by passing an array of `keyframes` objects
as the value of the `animationName` property. These keyframe animations timing and iteration count
can be managed with [traditional css rules for keyframe animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

```jsx
@Radium
class Spinner extends React.Component {
  render () {
    return (
      <div>
        <div style={styles.inner} />
      </div>
    );
  }
}

const pulseAnimation = Radium.keyframes(
  {
    '0%': {width: '10%'},
    '50%': {width: '50%'},
    '100%': {width: '10%'},
  },
  'pulse',
);

const blendAnimation = Radium.keyframes(
  {
    '0%': {background: 'red'},
    '25%': {background: 'yellow'},
    '50%': {background: 'green'},
    '75%': {background: 'blue'},
    '100%': {background: 'red'},
  },
  'blend',
);

const styles = {
  inner: {
    animationName: [pulseAnimation, blendAnimation],
    animationDuration: '2.5s, 8s',
    animationIterationCount: 'infinite, infinite',
    animationTimingFunction: 'linear, cubic-bezier(0.1, 0.7, 1.0, 0.1)',
    height: '4px',
    margin: '0 auto',
  },
};
```

## Plugins

### Built-in Plugins

Almost everything that Radium does, except iteration, is implemented as a plugin. Radium ships with a base set of plugins, all of which can be accessed via `Radium.Plugins.pluginName`. They are called in the following order:

- `mergeStyleArray` - If the `style` attribute is an array, intelligently merge each style object in the array. Deep merges nested style objects, such as `:hover`.
- `checkProps` - Performs basic correctness checks, such as ensuring you do not mix longhand and shorthand properties.
- `resolveMediaQueries` - Handles style entries like `'@media (...)': { ... }`, applying them only when the appropriate media query is hit. Can be configured using [config.matchMedia](#configmatchmedia).
- `resolveInteractionStyles` - Handles `':hover'`, `':focus'`, and `':active'` styles.
- `prefix` - Uses in-browser detection and a small mapping to add vendor prefixes to CSS properties and values.
- `checkProps` - Same as above, just run after everything else.

### Plugin Interface

All plugins are functions accept a PluginConfig, and return a PluginResult. The annotated flow types follow. A plugin is called once for every *rendered element* that has a `style` attribute, for example the `div` and `span` in `return <div style={...}><span style={...} /></div>;`.

**PluginConfig**
```jsx
type PluginConfig = {
  // Adds a chunk of css to the root style sheet
  addCSS: (css: string) => {remove: () => void},

  // Helper function when adding CSS
  appendImportantToEachValue: (style: Object) => Object;

  // May not be readable if code has been minified
  componentName: string,

  // The Radium configuration
  config: Config,

  // Converts an object of CSS rules to a string, for use with addCSS
  cssRuleSetToString: (
    selector: string,
    rules: Object,
    userAgent: ?string,
  ) => string,

  // Retrieve the value of a field on the component
  getComponentField: (key: string) => any,

  // Retrieve the value of a field global to the Radium module
  // Used so that tests can easily clear global state.
  getGlobalState: (key: string) => any,

  // Retrieve the value of some state specific to the rendered element.
  // Requires the element to have a unique key or ref or for an element key
  // to be passed in.
  getState: (stateKey: string, elementKey?: string) => any,

  // Helper function when adding CSS
  hash: (data: string) => string,

  // Returns true if the value is a nested style object
  isNestedStyle: (value: any) => bool,

  // Access to the mergeStyles utility
  mergeStyles: (styles: Array<Object>) => Object,

  // The props of the rendered element. This can be changed by each plugin,
  // and successive plugins will see the result of previous plugins.
  props: Object,

  // Calls setState on the component with the given key and value.
  // By default this is specific to the rendered element, but you can override
  // by passing in the `elementKey` parameter.
  setState: (stateKey: string, value: any, elementKey?: string) => void,

  // The style prop of the rendered element. This can be changed by each plugin,
  // and successive plugins will see the result of previous plugins. Kept
  // separate from `props` for ease of use.
  style: Object,

  // uses the exenv npm module
  ExecutionEnvironment: {
    canUseEventListeners: bool,
    canUseDOM: bool,
  }
};
```

**PluginResult**

```jsx
type PluginResult = ?{
  // Merged into the component directly. Useful for storing things for which you
  // don't need to re-render, event subscriptions, for instance.
  componentFields?: Object,

  // Merged into a Radium controlled global state object. Use this instead of
  // module level state for ease of clearing state between tests.
  globalState?: Object,

  // Merged into the rendered element's props.
  props?: Object,

  // Replaces (not merged into) the rendered element's style property.
  style?: Object,
};
```

If your plugin consumes custom style blocks, it should merge any applicable style blocks and strip any others out of the style object before returning to avoid errors farther down. For example, a hypothetical `enumPropResolver` might know how to resolve keys of the form `'propName=value'`, such that if `this.props.propName === 'value'`, it will merge in that style object. `enumPropResolver` should then also strip any other keys that will not be merged. Thus, if this style object is passed to `enumPropResolver`, and `this.props.type === 'error'`:

```jsx
{
  'type=success': {color: 'blue'},
  'type=error': {color: 'red'},
  'type=warning': {color: 'yellow'},
}
```

`enumPropResolver` should then return an object with the style property equal to:

```jsx
{
  color: 'red'
}
```

## Style Component

The `<Style>` component renders an HTML `<style>` tag containing a set of CSS rules. Using it, you can define an optional `scopeSelector` that all selectors in the resulting `<style>` element will include.

Without the `<Style>` component, it is prohibitively difficult to write a `<style>` element in React. To write a normal `<style>` element, you need to write your CSS as a multiline string inside of the element. `<Style>` simplifies this process, and adds prefixing and the ability to scope selectors.

If you include a `scopeSelector`, you can include CSS rules that should apply to that selector as well as any nested selectors. For example, the following

```jsx
<Style
  scopeSelector=".scoping-class"
  rules={{
    color: 'blue',
    span: {
      fontFamily: 'Lucida Console, Monaco, monospace'
    }
  }}
/>
```

will return:

```html
<style>
.scoping-class {
  color: 'blue';
}
.scoping-class span {
  font-family: 'Lucida Console, Monaco, monospace';
}
</style>
```

### Props

#### rules

An object of CSS rules to render. Each key of the rules object is a CSS selector and the value is an object of styles. If rules is empty, the component will render nothing.

```jsx
var Radium = require('radium');
var Style = Radium.Style;
// or
import Radium, { Style } from 'radium';

<Style rules={{
  body: {
    margin: 0,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
  },
  html: {
    background: '#ccc',
    fontSize: '100%'
  },
  mediaQueries: {
    '(min-width: 550px)': {
      html:  {
        fontSize: '120%'
      }
    },
    '(min-width: 1200px)': {
      html:  {
        fontSize: '140%'
      }
    }
  },
  'h1, h2, h3': {
    fontWeight: 'bold'
  }
}} />
```


#### scopeSelector

A string that any included selectors in `rules` will be appended to. Use to scope styles in the component to a particular element. A good use case might be to generate a unique ID for a component to scope any styles to the particular component that owns the `<Style>` component instance.

```jsx
<div className="TestClass">
  <Style
    scopeSelector=".TestClass"
    rules={{
      h1: {
        fontSize: '2em'
      }
    }}
  />
</div>
```

### Notes

Some style properties, like [`content`](https://developer.mozilla.org/en-US/docs/Web/CSS/content), allow quoted strings or keywords as values. Because all non-numerical property values are written
as strings in Radium style objects, you must explicitly add quotes to string value for these properties: `content: "'Hello World!'"`.

## StyleRoot Component

_Props: Accepts all props valid on `div` and optional `radiumConfig`_

Usually wrapped around your top-level App component. StyleRoot wraps its children in a plain div followed by the root style sheet. Radium plugins, like keyframes and media queries, use this style sheet to inject CSS at runtime. Because the style sheet appears after your rendered elements, it is populated correctly during a server render.

StyleRoot transfers all of its props to the rendered `div`, and is itself wrapped in Radium, so you can pass it inline styles or `radiumConfig`.

```jsx
import {StyleRoot} from 'radium';

class App extends React.Component {
  render() {
    return (
      <StyleRoot>
        ... rest of your app ...
      </StyleRoot>
    );
  }
}
```

**Note:** StyleRoot passes the style-keeper (the object where styles are collected) down to other Radium components via context. Because of this, you cannot use keyframes or media queries in *direct children* of the `<StyleRoot>`, e.g.

```jsx
// COUNTEREXAMPLE, DOES NOT WORK
<StyleRoot>
  <div style={{'@media print': {color: 'black'}}} />
</StyleRoot>
```

You'll have to break out that piece into a proper component:

```jsx
class BodyText extends React.Component {
  render() {
    return <div style={{'@media print': {color: 'black'}}} />;
  }
}

class App extends React.Component {
  render() {
    return (
      <StyleRoot>
        <BodyText>...</BodyText>
      </StyleRoot>
    );
  }
}
```

## TestMode

Directly off the main Radium object you can access `TestMode`, used to control internal Radium state and behavior during tests. It is only available in non-production builds.

- `Radium.TestMode.clearState()` - clears the global Radium state, currently only the cache of media query listeners.
- `Radium.TestMode.enable()` - enables "test mode", which doesn’t throw or warn as much. Currently it just doesn’t throw when using addCSS without StyleRoot.
- `Radium.TestMode.disable()` - disables "test mode"
