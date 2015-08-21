/* @flow */

var MouseUpListener = require('./mouse-up-listener');
var getState = require('./get-state');
var mergeStyles = require('./merge-styles');
var setStyleState = require('./set-style-state');

var ExecutionEnvironment = require('exenv');

var _getStyleState = function (component, key, value) {
  return getState(component.state, key, value);
};

var _mouseUp = function (component) {
  Object.keys(component.state._radiumStyleState).forEach(function (key) {
    if (_getStyleState(component, key, ':active')) {
      setStyleState(component, key, {':active': false});
    }
  });
};

var resolveInteractonStyles = function (component, key, props, style) {
	var newProps = {};

	// Only add handlers if necessary
	if (style[':hover'] || style[':active']) {
		// Always call the existing handler if one is already defined.
		// This code, and the very similar ones below, could be abstracted a bit
		// more, but it hurts readability IMO.
		var existingOnMouseEnter = props.onMouseEnter;
		newProps.onMouseEnter = function (e) {
			existingOnMouseEnter && existingOnMouseEnter(e);
			setStyleState(component, key, {':hover': true});
		};

		var existingOnMouseLeave = props.onMouseLeave;
		newProps.onMouseLeave = function (e) {
			existingOnMouseLeave && existingOnMouseLeave(e);
			setStyleState(component, key, {':hover': false});
		};
	}

	if (style[':active']) {
		var existingOnMouseDown = props.onMouseDown;
		newProps.onMouseDown = function (e) {
			existingOnMouseDown && existingOnMouseDown(e);
			component._lastMouseDown = Date.now();
			setStyleState(component, key, {':active': true});
		};
	}

	if (style[':focus']) {
		var existingOnFocus = props.onFocus;
		newProps.onFocus = function (e) {
			existingOnFocus && existingOnFocus(e);
			setStyleState(component, key, {':focus': true});
		};

		var existingOnBlur = props.onBlur;
		newProps.onBlur = function (e) {
			existingOnBlur && existingOnBlur(e);
			setStyleState(component, key, {':focus': false});
		};
	}

	if (
		style[':active'] &&
		!component._radiumMouseUpListener &&
		ExecutionEnvironment.canUseEventListeners
	) {
		component._radiumMouseUpListener = MouseUpListener.subscribe(
			_mouseUp.bind(null, component)
		);
	}

	// Merge the styles in the order they were defined
	var interactionStyles = Object.keys(style)
		.filter(function (name) {
			return (
				(name === ':active' && _getStyleState(component, key, ':active')) ||
				(name === ':hover' && _getStyleState(component, key, ':hover')) ||
				(name === ':focus' && _getStyleState(component, key, ':focus'))
			);
		})
		.map(function (name) { return style[name]; });
		
	newProps.style = mergeStyles([style, ...interactionStyles]);

	return newProps;
}

module.exports = resolveInteractonStyles;
