/* @flow */

var MouseUpListener = require('./mouse-up-listener');

var ExecutionEnvironment = require('exenv');

var _mouseUp = function (component, util) {
  Object.keys(component.state._radiumStyleState).forEach(function (key) {
    if (util.getState(component.state, key, ':active')) {
      util.setStyleState(component, key, {':active': false});
    }
  });
};

var resolveInteractonStyles = function ({component, key, props, style, util}) {
	var newComponentFields = {};
	var newProps = {};

	// Only add handlers if necessary
	if (style[':hover'] || style[':active']) {
		// Always call the existing handler if one is already defined.
		// This code, and the very similar ones below, could be abstracted a bit
		// more, but it hurts readability IMO.
		var existingOnMouseEnter = props.onMouseEnter;
		newProps.onMouseEnter = function (e) {
			existingOnMouseEnter && existingOnMouseEnter(e);
			util.setStyleState(component, key, {':hover': true});
		};

		var existingOnMouseLeave = props.onMouseLeave;
		newProps.onMouseLeave = function (e) {
			existingOnMouseLeave && existingOnMouseLeave(e);
			util.setStyleState(component, key, {':hover': false});
		};
	}

	if (style[':active']) {
		var existingOnMouseDown = props.onMouseDown;
		newProps.onMouseDown = function (e) {
			existingOnMouseDown && existingOnMouseDown(e);
			newComponentFields._lastMouseDown = Date.now();
			util.setStyleState(component, key, {':active': true});
		};
	}

	if (style[':focus']) {
		var existingOnFocus = props.onFocus;
		newProps.onFocus = function (e) {
			existingOnFocus && existingOnFocus(e);
			util.setStyleState(component, key, {':focus': true});
		};

		var existingOnBlur = props.onBlur;
		newProps.onBlur = function (e) {
			existingOnBlur && existingOnBlur(e);
			util.setStyleState(component, key, {':focus': false});
		};
	}

	if (
		style[':active'] &&
		!component._radiumMouseUpListener &&
		ExecutionEnvironment.canUseEventListeners
	) {
		newComponentFields._radiumMouseUpListener = MouseUpListener.subscribe(
			_mouseUp.bind(null, component, util)
		);
	}

	// Merge the styles in the order they were defined
	var interactionStyles = Object.keys(style)
		.filter(function (name) {
			return (
				(name === ':active' && util.getState(component.state, key, ':active')) ||
				(name === ':hover' && util.getState(component.state, key, ':hover')) ||
				(name === ':focus' && util.getState(component.state, key, ':focus'))
			);
		})
		.map(function (name) { return style[name]; });

	var newStyle = util.mergeStyles([style, ...interactionStyles]);

	// Remove media queries
	newStyle = Object.keys(newStyle).reduce(
		(styleWithoutInteractions, key) => {
			if (key !== ':hover' && key !== ':active' && key !== ':focus') {
				styleWithoutInteractions[key] = newStyle[key];
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
}

module.exports = resolveInteractonStyles;
