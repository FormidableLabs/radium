jest.autoMockOff();

var MouseUpListener = require('../modules/mouse-up-listener');
var merge = require('lodash/object/merge');
var resolveStyles = require('../modules/resolve-styles');

describe('resolveStyles', function() {
  var component;

  beforeEach(function() {
    MouseUpListener.subscribe = jest.genMockFunction();

    component = {
      setState: function(newState) {
        this.state = merge(this.state, newState);
      },
      state: {}
    };
  });

  describe('no-op behavior', function() {

    it('doesn\'t explode', function() {
      var renderedElement = {props: {}};

      var result = resolveStyles(component, renderedElement);

      expect(result).toBe(renderedElement);
      expect(result.props).toBe(renderedElement.props);
    });

    it('passes through normal style objects', function() {
      var renderedElement = {props: {style: {color: 'blue'}}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toBe(renderedElement.props.style);
    });

    it('passes through normal style objects of children', function() {
      var renderedElement = {props: {
        children: [
          {style: {color: 'blue'}}
        ]
      }};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.children[0].style)
        .toBe(renderedElement.props.children[0].style);
    });

  });

  describe('style array', function() {

    it('merges an array of style objects', function() {
      var renderedElement = {props: {style: [
        {background: 'white'},
        {color: 'blue'},
      ]}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'white',
        color: 'blue'
      });
    });

    it('merges nested special styles', function() {
      var getRenderedElement = function() {
        return {props: {style: [
          {':hover': { background: 'white'}},
          {':hover': {color: 'blue'}},
        ]}};
      };

      var result = resolveStyles(component, getRenderedElement());
      result.props.onMouseEnter();
      result = resolveStyles(component, getRenderedElement());

      expect(result.props.style).toEqual({
        background: 'white',
        color: 'blue'
      });
    });

  });

  describe(':hover', function() {

    it('strips special styles if not applied', function() {
      var renderedElement = {props: {style: {
        background: 'blue',
        ':hover': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({background: 'blue'});
    });

    it('adds appropriate handlers for hover styles', function() {
      var renderedElement = {props: {style: {
        ':hover': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);

      expect(typeof result.props.onMouseEnter).toBe('function');
      expect(typeof result.props.onMouseLeave).toBe('function');
    });

    it('adds hover styles on mouse enter', function() {
      var style = {
        background: 'blue',
        ':hover': {background: 'red'}
      };

      var result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');

      result.props.onMouseEnter();

      // Must create a new renderedElement each time, same as React, since
      // resolveStyles mutates
      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    it('removes hover styles on mouse leave', function() {
      var style = {
        background: 'blue',
        ':hover': {background: 'red'}
      };

      var result = resolveStyles(component, {props: {style: style}});

      result.props.onMouseEnter();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');

      result.props.onMouseLeave();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');
    });

    it('calls existing onMouseEnter handler', function() {
      var style = {
        background: 'blue',
        ':hover': {background: 'red'}
      };

      var originalOnMouseEnter = jest.genMockFunction();

      var result = resolveStyles(
        component,
        {
          props: {
            onMouseEnter: originalOnMouseEnter,
            style: style
          }
        }
      );

      result.props.onMouseEnter();

      expect(originalOnMouseEnter).toBeCalled();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    it('calls existing onMouseLeave handler', function() {
      var style = {
        background: 'blue',
        ':hover': {background: 'red'}
      };

      var originalOnMouseLeave = jest.genMockFunction();

      var result = resolveStyles(
        component,
        {
          props: {
            onMouseLeave: originalOnMouseLeave,
            style: style
          }
        }
      );

      result.props.onMouseEnter();
      result.props.onMouseLeave();

      expect(originalOnMouseLeave).toBeCalled();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');
    });

  });

  describe(':active', function() {

    it('adds appropriate handlers for active styles', function() {
      var renderedElement = {props: {style: {
        ':active': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);

      expect(typeof result.props.onMouseDown).toBe('function');
      expect(MouseUpListener.subscribe).toBeCalled();
    });

    it('adds active styles on mouse down', function() {
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };

      var result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');

      result.props.onMouseDown();

      // Must create a new renderedElement each time, same as React, since
      // resolveStyles mutates
      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    it('removes active styles on mouse up', function() {
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };

      var result = resolveStyles(component, {props: {style: style}});

      result.props.onMouseDown();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');

      // tigger global mouseup handler
      MouseUpListener.subscribe.mock.calls[0][0]();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');
    });

    it('calls existing onMouseDown handler', function() {
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };

      var originalOnMouseDown = jest.genMockFunction();

      var result = resolveStyles(
        component,
        {
          props: {
            onMouseDown: originalOnMouseDown,
            style: style
          }
        }
      );

      result.props.onMouseDown();

      expect(originalOnMouseDown).toBeCalled();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

  });

  describe(':focus', function() {

    it('strips special styles if not applied', function() {
      var renderedElement = {props: {style: {
        background: 'blue',
        ':focus': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({background: 'blue'});
    });

    it('adds appropriate handlers for focus styles', function() {
      var renderedElement = {props: {style: {
        ':focus': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);

      expect(typeof result.props.onFocus).toBe('function');
      expect(typeof result.props.onBlur).toBe('function');
    });

    it('adds focus styles on mouse enter', function() {
      var style = {
        background: 'blue',
        ':focus': {background: 'red'}
      };

      var result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');

      result.props.onFocus();

      // Must create a new renderedElement each time, same as React, since
      // resolveStyles mutates
      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    it('removes focus styles on mouse leave', function() {
      var style = {
        background: 'blue',
        ':focus': {background: 'red'}
      };

      var result = resolveStyles(component, {props: {style: style}});

      result.props.onFocus();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');

      result.props.onBlur();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');
    });

    it('calls existing onFocus handler', function() {
      var style = {
        background: 'blue',
        ':focus': {background: 'red'}
      };

      var originalOnFocus = jest.genMockFunction();

      var result = resolveStyles(
        component,
        {
          props: {
            onFocus: originalOnFocus,
            style: style
          }
        }
      );

      result.props.onFocus();

      expect(originalOnFocus).toBeCalled();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    it('calls existing onBlur handler', function() {
      var style = {
        background: 'blue',
        ':focus': {background: 'red'}
      };

      var originalOnBlur = jest.genMockFunction();

      var result = resolveStyles(
        component,
        {
          props: {
            onBlur: originalOnBlur,
            style: style
          }
        }
      );

      result.props.onFocus();
      result.props.onBlur();

      expect(originalOnBlur).toBeCalled();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');
    });

  });

});
