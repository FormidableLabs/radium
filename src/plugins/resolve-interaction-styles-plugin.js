/** @flow */

import type {PluginConfig, PluginResult} from './index';

import MouseUpListener from './mouse-up-listener';

const _isInteractiveStyleField = function(styleFieldName) {
  return styleFieldName === ':hover' ||
    styleFieldName === ':active' ||
    styleFieldName === ':focus';
};

const resolveInteractionStyles = function(config: PluginConfig): PluginResult {
  const {
    ExecutionEnvironment,
    getComponentField,
    getState,
    mergeStyles,
    props,
    setState,
    style
  } = config;

  const newComponentFields = {};
  const newProps = {};

  // Only add handlers if necessary
  if (style[':hover']) {
    // Always call the existing handler if one is already defined.
    // This code, and the very similar ones below, could be abstracted a bit
    // more, but it hurts readability IMO.
    const existingOnMouseEnter = props.onMouseEnter;
    newProps.onMouseEnter = function(e) {
      existingOnMouseEnter && existingOnMouseEnter(e);
      setState(':hover', true);
    };

    const existingOnMouseLeave = props.onMouseLeave;
    newProps.onMouseLeave = function(e) {
      existingOnMouseLeave && existingOnMouseLeave(e);
      setState(':hover', false);
    };
  }

  if (style[':active']) {
    const existingOnMouseDown = props.onMouseDown;
    newProps.onMouseDown = function(e) {
      existingOnMouseDown && existingOnMouseDown(e);
      newComponentFields._lastMouseDown = Date.now();
      setState(':active', 'viamousedown');
    };

    const existingOnKeyDown = props.onKeyDown;
    newProps.onKeyDown = function(e) {
      existingOnKeyDown && existingOnKeyDown(e);
      if (e.key === ' ' || e.key === 'Enter') {
        setState(':active', 'viakeydown');
      }
    };

    const existingOnKeyUp = props.onKeyUp;
    newProps.onKeyUp = function(e) {
      existingOnKeyUp && existingOnKeyUp(e);
      if (e.key === ' ' || e.key === 'Enter') {
        setState(':active', false);
      }
    };
  }

  if (style[':focus']) {
    const existingOnFocus = props.onFocus;
    newProps.onFocus = function(e) {
      existingOnFocus && existingOnFocus(e);
      setState(':focus', true);
    };

    const existingOnBlur = props.onBlur;
    newProps.onBlur = function(e) {
      existingOnBlur && existingOnBlur(e);
      setState(':focus', false);
    };
  }

  if (
    style[':active'] &&
    !getComponentField('_radiumMouseUpListener') &&
    ExecutionEnvironment.canUseEventListeners
  ) {
    newComponentFields._radiumMouseUpListener = MouseUpListener.subscribe(
      () => {
        Object.keys(
          getComponentField('state')._radiumStyleState
        ).forEach(key => {
          if (getState(':active', key) === 'viamousedown') {
            setState(':active', false, key);
          }
        });
      }
    );
  }

  // Merge the styles in the order they were defined
  const interactionStyles = props.disabled
    ? [style[':disabled']]
    : Object.keys(style)
        .filter(name => _isInteractiveStyleField(name) && getState(name))
        .map(name => style[name]);

  let newStyle = mergeStyles([style].concat(interactionStyles));

  // Remove interactive styles
  newStyle = Object.keys(newStyle).reduce(
    (styleWithoutInteractions, name) => {
      if (!_isInteractiveStyleField(name) && name !== ':disabled') {
        styleWithoutInteractions[name] = newStyle[name];
      }
      return styleWithoutInteractions;
    },
    {}
  );

  return {
    componentFields: newComponentFields,
    props: newProps,
    style: newStyle
  };
};

export default resolveInteractionStyles;
