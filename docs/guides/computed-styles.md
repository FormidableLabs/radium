# Computed Styles in Radium

For some use cases, you may want to compute styles with Radium based on other styles that are going to be applied based on your current modifiers, state, or media queries.

For example, you might have a `<Button>` component with a hover state that darkens the Button's background color. If your button has several modifiers that could each apply different background colors, computed styles will allow you to tell Radium to darken the current background color by 20%, without knowing what the current background color is.

To use computed styles, add a `computed` property to your Radium style object under your default styles, any modifier, or any browser state. In this example, we use the [color](https://www.npmjs.com/package/color) module to lighten the element's background color.

```js
{
  states: [
    {
      hover: {
        computed: {
          backgroundColor: function (styles) {
            return color(styles.backgroundColor).lighten(0.2).hexString()
          }
        }
      }
    }
  ]
}
```

The computed property value should be an object with any CSS properties that should be computed. Each property's value should be a function that takes a `styles` parameter and returns the computed value of the CSS property.

After resolving which styles should be applied, Radium will run each of these computed style functions, passing in the resolved style object as `styles`, and will merge the computed styles into your style object before rendering.

This functionality is very powerful, and can allow you to easily do things like automatically adjust component color schemes by changing base colors.
