# Radium API

**Table of Contents**

- [Radium](#radium)
  - [Sample Style Object](#sample-style-object)
  - [config.matchMedia](#configmatchmedia)
  - [config.plugins](#configplugins)
- [getState](#getstate)
- [keyframes](#keyframes)
- [Plugins](#plugins)
- [Style Component](#style-component)
- [PrintStyleSheet Component](#printstylesheet-component)

## Radium

`Radium` itself is a higher-order component, whose job is to:
- Provide initial state
- Process the `style` attribute after `render()`
- Clean up any resources when the component unmounts

Usage with `class` and ES7 decorators:

```as
@Radium
class MyComponent extends React.Component { ... }
```

Usage with `createClass`:

```as
var MyComponent = React.createClass({ ... });
module.exports = Radium(MyComponent);
```

`Radium`s primary job is to apply interactive or media query styles, but even if you are not using any special styles, the higher order component will still:
- Merge arrays of styles passed as the `style` attribute
- Automatically vendor prefix the `style` object

You can also pass a configuration object to `@Radium`:

```a
@Radium({matchMedia: mockMatchMedia})
class MyComponent extends React.Component { ... }

// or with createClass

var MyComponent = React.createClass({ ... });
module.exports = Radium({matchMedia: mockMatchMedia})(MyComponent);
```

You may want to have project-wide Radium settings. Simply create a function that
wraps Radium, and use it instead of `@Radium`:

```as
function ConfiguredRadium(component) {
  return Radium(config)(component);
}

// Usage
@ConfiguredRadium
class MyComponent extends React.Component { ... }
```

Radium can be called any number of times with a config object, and later configs
will be merged with and overwrite previous configs. That way, you can still
override settings on a per-component basis:

```as
@ConfiguredRadium(config)
class MySpecialComponent extends React.Component { ... }
```

Possible configuration values:
- [`matchMedia`](#configmatchmedia)
- [`plugins`](#configplugins)

### Sample Style Object

```as
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

### config.matchMedia

Allows you to replace the `matchMedia` function that Radium uses. The default is `window.matchMedia`, and the primary use case for replacing it is to use media queries on the server. You'll have to send the width and height of the page to the server somehow, and then use a [mock for match media](https://github.com/azazdeaz/match-media-mock) that implements the [`window.matchMedia` API](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia). Your code could look like this:

**Server**

```as
var ConfiguredRadium = require('./configured-radium');
var matchMediaMock = require('match-media-mock').create();
ConfiguredRadium.setMatchMedia(matchMediaMock);

app.get('/app/:width/:height', function(req, res) {
  matchMediaMock.setConfig({
    type: 'screen',
    width: req.params.width,
    height: req.params.height,
  });

  // Your application code uses `@ConfiguredRadium` instead of `@Radium`
  var html = React.renderToString(<RadiumApp />);

  res.end(html);
});
```

**ConfiguredRadium.js**

```as
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

```as
var ConfiguredRadium = require('./configured-radium');

@ConfiguredRadium
class MyComponent extends React.Component { ... }
```

See [#146](https://github.com/FormidableLabs/radium/pull/146) for more info.

### config.plugins
**Array&lt;Plugin&gt;**

Replaces all plugins with the provided set. See [Plugins](#plugins) for more information.

Because the `plugins` config replaces all plugins, you have to provide the built-ins if you want to keep the default Radium functionality. A simple example of creating and adding a `styleLogger` plugin:

```js
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
      Radium.Plugins.prefix,
      styleLogger,
      Radium.Plugins.checkProps,
    ],
  })(component);
}

// Usage
@ConfiguredRadium
class MyComponent extends React.Component { ... }
```

You will typically want to put plugins before the final `checkProps` so that you can still benefit from the checks it provides. If your plugin might produce other pseudo-style blocks, like `@media` consumed by `resolveMediaQueries` or `:hover` consumed by `resolveInteractionStyles`, you would want to have your plugin run before those plugins.

You can of course omit any or all of the built-in plugins, and replace them with your own version. For example, you may want to omit `Radium.Plugins.prefix` entirely if you aren't using vendor prefixes or are using a [compile-time solution](https://github.com/UXtemple/babel-plugin-react-autoprefix) instead.

## getState

**Radium.getState(state, elementKey, value)**

Query Radium's knowledge of the browser state for a given element key. This is particularly useful if you would like to set styles for one element when another element is in a particular state, e.g. show a message when a button is hovered.

Note that the target element specified by `elementKey` must have the state you'd like to check defined in its style object so that Radium knows to add the handlers. It can be empty, e.g. `':hover': {}`.

Parameters:

- **state** - you'll usually pass `this.state`, but sometimes you may want to pass a previous state, like in `shouldComponentUpdate`, `componentWillUpdate`, and `componentDidUpdate`
- **elementKey** - if you used multiple elements, pass the same `key=""` or `ref=""`. If you only have one element, you can leave it blank (`'main'` will be inferred)
- **value** - one of the following: `:active`, `:focus`, and `:hover`
- **returns** `true` or `false`

Usage:

```as
    Radium.getState(this.state, 'button', ':hover')
```

## keyframes

**Radium.keyframes(keyframes, [componentName], [prefixFunction])**

Create a keyframes animation for use in any inline style. `keyframes` is a helper that translates the keyframes object you pass in to CSS and injects the `@keyframes` (prefixed properly) definition into a style sheet. Automatically generates and returns a name for the keyframes, that you can then use in the value for `animation`. Radium will automatically apply vendor prefixing to keyframe styles.

`Radium.keyframes` takes an optional second parameter, `componentName`. This is optional as you may not always have a component name to pass. If you do have a `componentName` however, it is a good idea to pass that as a parameter for better warning & error reporting.

`Radium.keyframes` takes an optional third parameter, `prefixFunction`. `prefixFunction` replaces the built-in prefixer with a function of your own. `prefixFunction` is called with two arguments, the `styles` object, and the `componentName`, e.g. `prefixFunction(styles, componentName)`.

```as
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

var pulseKeyframes = Radium.keyframes({
  '0%': {width: '10%'},
  '50%': {width: '50%'},
  '100%': {width: '10%'},
}, 'Spinner');

var styles = {
  inner: {
    animation: `${pulseKeyframes} 3s ease 0s infinite`,
    background: 'blue',
    height: '4px',
    margin: '0 auto',
  }
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
```js
type PluginConfig = {
  // May not be readable if code has been minified
  componentName: string,

  // The Radium configuration
  config: Config,

  // Retrieve the value of a field on the component
  getComponentField: (key: string) => any,

  // Retrieve the value of a field global to the Radium module
  // Used so that tests can easily clear global state.
  getGlobalState: (key: string) => any,

  // Retrieve the value of some state specific to the rendered element.
  // Requires the element to have a unique key or ref or for an element key
  // to be passed in.
  getState: (stateKey: string, elementKey?: string) => any,

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

```js
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

```js
{
  'type=success': {color: 'blue'},
  'type=error': {color: 'red'},
  'type=warning': {color: 'yellow'},
}
```

`enumPropResolver` should then return an object with the style property equal to:

```js
{
  color: 'red'
}
```

## Style Component

The `<Style>` component renders an HTML `<style>` tag containing a set of CSS rules. Using it, you can define an optional `scopeSelector` that all selectors in the resulting `<style>` element will include.

Without the `<Style>` component, it is prohibitively difficult to write a `<style>` element in React. To write a normal `<style>` element, you need to write your CSS as a multiline string inside of the element. `<Style>` simplifies this process, and adds prefixing and the ability to scope selectors.

### Props

#### rules

An object of CSS rules to render. Each key of the rules object is a CSS selector and the value is an object of styles. If rules is empty, the component will render nothing.

```as
var Radium = require('radium');
var Style = Radium.Style;

// or
import Radium, { Style } from 'radium'

<Style rules={{
  body: {
    margin: 0,
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif'
  },
  html: {
    background: '#ccc'
  },
  'h1, h2, h3': {
    fontWeight: 'bold'
  }
}} />
```


#### scopeSelector

A string that any included selectors in `rules` will be appended to. Use to scope styles in the component to a particular element. A good use case might be to generate a unique ID for a component to scope any styles to the particular component that owns the `<Style>` component instance.

```as
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

#### prefix

Optional prop to replace the built-in prefixer with a function of your own. `prefix` is called with two arguments, the `styles` object, and the `componentName`, e.g. `prefix(styles, componentName)`.

## PrintStyleSheet component

In order to fully support print styling it is necessary to use CSS because of browser differences, as described in [#132](https://github.com/FormidableLabs/radium/issues/132#issuecomment-99805511). Radium allows you to do this easily by specifying print styles as static properties of your components.

With ES7 decorators and static class properties:

```as
@Radium
class MyComponent extends React.Component {
  static printStyles = {
    wrapper: { background: 'black' },
    text: { color: 'red' }
  };

  render() {
    return (
      <div className={this.printStyleClass.wrapper}>
        <p className={this.printStyleClass.text}>I'm red on print</p>
      </div>
    );
  }
}
```

With `createClass`:

```as
Radium(React.createClass({
  displayName: 'MyComponent',

  statics: {
    printStyles = {
      wrapper: { background: 'black' },
      text: { color: 'red' }
    }
  },

  render() {
    return (
      <div className={this.printStyleClass.wrapper}>
        <p className={this.printStyleClass.text}>I'm red on print</p>
      </div>
    );
  }
}));
```

In your root component render `<PrintStyleSheet />` and it will render a style tag containing all the CSS needed for printing, wrapped in a `@media print` query. You should only render `<PrintStyleSheet />` once. It will contain all the print styles for every component.

**App.js**
```as
import {PrintStyleSheet} from 'radium';

class App extends React.Component {
  render() {
    return (
      <div>
        <PrintStyleSheet />
        ... rest of your app ...
      </div>
    );
  }
}
```
