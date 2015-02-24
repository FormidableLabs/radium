# Radium API

## Sample Style Object

```js
{
  // Default styles
  margin: 0,

  // Default browser states
  states: [
    {
      hover: {
        background: '#000'
      }
    },
    {
      focus: {
        background: '#333'
      }
    },
    {
      active: {
        background: '#666'
      }
    }
  ],

  // Default media queries
  mediaQueries: [
    {
      small: {
        padding: 10
      }
    },
    {
      large: {
        padding: 20
      }
    }
  ],

  modifiers: [
    {
      // Modifier with string value
      theme: {
        // <Component theme="coffee" />
        coffee: {
          color: '#fff',

          // Modifier browser states
          states: [
            {
              hover: {
                color: '#ccc',

                // Computed style callbacks, evaluated after the rest of the
                // styles are resolved.
                computed: {
                  // Computed background color callback
                  // `styles`: The resolved styles object.
                  background: function (styles) {
                    return styles.borderColor;
                  }
                }
              }
            }
          ],

          // Modifier media queries
          mediaQueries: [
            {
              large: {
                padding: 24
              }
            }
          ]
        }
      }
    },
    {
      // Modifier with boolean value
      // <Component block={true} />
      block: {
        display: 'block'
      }
    }
  ]
}
```

## StyleResolverMixin

The style resolver mixin resolves a [style object](#sample-style-object) based on currently active modifiers, states, media queries, and computed styles.

### buildStyles

Resolves a style object into an object that can be set as the value of an element's `style` attribute.

#### Signature

`buildStyles(styles, additionalModifiers, excludeProps)`

#### Arguments

##### styles

Type: `Object`

A Radium [style object](#sample-style-object).

##### additionalModifiers

Type: `Object` (Optional)

An object of modifiers used in style resolution. Passed in modifiers take precedence over modifiers from `this.props`.

##### excludeProps

Type: `Boolean` Default: `false` (Optional)

A flag to exclude `this.props` from component modifiers (meaning that only `additionalModifiers` will be used).

#### Examples

```js
// Standard usage
var styles = this.buildStyles(radStyles);

// Including additional modifiers
var customModifierStyles = this.buildStyles(radStyles, {
  active: this.state.active
});

// Excluding this.props
var noPropsStyles = this.buildStyles(radStyles, {
  active: this.state.active
}, true);
```

## BrowserStateMixin

The browser state mixin manages hover, active, and focus states. If a component should include browser state styles, add it as a mixin and include `this.getBrowserStateEvents()` on the element that should listen for events.

### getBrowserStateEvents

Returns a hash of browser state events handlers to set component state when the element is hovered, focused, or active.

Apply to the component with a spread operator (`{...}`).

#### Signature

`getBrowserStateEvents()`

#### Examples

```js
<Component
  {...this.getBrowserStateEvents()}
/>
```

## MatchMediaBase

The match media base mixin sets and manages media queries for your application. Add it as a mixin at the top level of your app and initialize with `MatchMediaBase.init()`.

### init

Initialize a set of media queries. Should be initialized outside of the top level React component.

#### Signature

`MatchMediaBase.init(mediaQueries)`

#### Arguments

##### mediaQueries

Type: 'Object'

An object of media query names and strings.

#### Examples

```js
MatchMediaBase.init({
  medium: '(min-width: 768px)',
  large: '(min-width: 1200px)'
});
```

## MatchMediaItem

The match media item mixin applies media queries set in `MatchMediaBase` to a component. To use, add it as a mixin to any component that is a descendent of the component with `MatchMediaBase` that should include media query styles.
