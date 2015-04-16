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
        children: [{
          _isReactElement: true,
          props: {style: {color: 'blue'}},
        }]
      }};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.children[0].props.style)
        .toBe(renderedElement.props.children[0].props.style);
    });

    it('ignores invalid children', function() {
      var renderedElement = {props: {
        children: [{
          props: {style: {color: 'blue'}},
        }]
      }};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.children[0].props.style)
        .toBe(renderedElement.props.children[0].props.style);
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

    it('skips falsy and non-object entries', function() {
      var renderedElement = {props: {style: [
        {background: 'white'},
        false,
        null,
        undefined,
        '',
        [1,2,3],
        {color: 'blue'},
      ]}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'white',
        color: 'blue'
      });
    });

    it('overwrites earlier styles with later ones', function() {
      var renderedElement = {props: {style: [
        {background: 'white'},
        {background: 'blue'},
      ]}};

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).toEqual({
        background: 'blue'
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
    createPseduoStyleTests('hover', 'onMouseEnter', 'onMouseLeave');
  });

  describe(':focus', function() {
    createPseduoStyleTests('focus', 'onFocus', 'onBlur');
  });

  describe(':active', function() {
    createPseduoStyleTests('active', 'onMouseDown');

    it('subscribes to mouse up listener', function() {
      var renderedElement = {props: {style: {
        ':active': {background: 'red'}
      }}};

      var result = resolveStyles(component, renderedElement);

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

  function createPseduoStyleTests(pseudo, onHandlerName, offHandlerName) {

    it('strips special styles if not applied', function() {
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var result = resolveStyles(component, {props: {style: style}});

      expect(result.props.style).toEqual({background: 'blue'});
    });

    it('adds appropriate handlers for ' + pseudo + ' styles', function() {
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var result = resolveStyles(component, {props: {style: style}});

      expect(typeof result.props[onHandlerName]).toBe('function');
      if (offHandlerName) {
        expect(typeof result.props[offHandlerName]).toBe('function');
      }
    });

    it('adds ' + pseudo + ' styles ' + onHandlerName, function() {
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('blue');

      result.props[onHandlerName]();

      // Must create a new renderedElement each time, same as React, since
      // resolveStyles mutates
      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    it('throws if multiple elements have the same key', function() {
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var getRenderedElement = function() {
        return {props: {children: [
          {_isReactElement: true, key: 'foo', props: {style: style}},
          {_isReactElement: true, key: 'foo', props: {style: style}},
        ]}};
      };

      expect(function() {
        resolveStyles(component, getRenderedElement());
      }).toThrow();
    });

    it('adds ' + pseudo + ' styles to correct element by key', function() {
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var getRenderedElement = function() {
        return {props: {children: [
          {_isReactElement: true, key: 'foo', props: {}},
          {_isReactElement: true, key: 'bar', props: {style: style}},
        ]}};
      };

      var result = resolveStyles(component, getRenderedElement());
      expect(result.props.children[0].props.style).toEqual(null);
      expect(result.props.children[1].props.style.background).toEqual('blue');

      result.props.children[1].props[onHandlerName]();

      result = resolveStyles(component, getRenderedElement());
      expect(result.props.children[0].props.style).toEqual(null);
      expect(result.props.children[1].props.style.background).toEqual('red');
    });

    it('adds ' + pseudo + ' styles to correct element by ref', function() {
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var getRenderedElement = function() {
        return {props: {children: [
          {_isReactElement: true, ref: 'foo', props: {}},
          {_isReactElement: true, ref: 'bar', props: {style: style}},
        ]}};
      };

      var result = resolveStyles(component, getRenderedElement());
      expect(result.props.children[0].props.style).toEqual(null);
      expect(result.props.children[1].props.style.background).toEqual('blue');

      result.props.children[1].props[onHandlerName]();

      result = resolveStyles(component, getRenderedElement());
      expect(result.props.children[0].props.style).toEqual(null);
      expect(result.props.children[1].props.style.background).toEqual('red');
    });

    if (offHandlerName) {
      it('removes ' + pseudo + ' styles ' + offHandlerName, function() {
        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};

        var result = resolveStyles(component, {props: {style: style}});

        result.props[onHandlerName]();

        result = resolveStyles(component, {props: {style: style}});
        expect(result.props.style.background).toEqual('red');

        result.props[offHandlerName]();

        result = resolveStyles(component, {props: {style: style}});
        expect(result.props.style.background).toEqual('blue');
      });
    }

    it('calls existing ' + onHandlerName + ' handler', function() {
      var originalOnHandler = jest.genMockFunction();

      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = {props: {style: style}};
      renderedElement.props[onHandlerName] = originalOnHandler;

      var result = resolveStyles(component, renderedElement);

      result.props[onHandlerName]();

      expect(originalOnHandler).toBeCalled();

      result = resolveStyles(component, {props: {style: style}});
      expect(result.props.style.background).toEqual('red');
    });

    if (offHandlerName) {
      it('calls existing ' + offHandlerName + ' handler', function() {
        var originalOffHandler = jest.genMockFunction();

        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};
        style[offHandlerName] = originalOffHandler;

        var renderedElement = {props: {style: style}};
        renderedElement.props[offHandlerName] = originalOffHandler;

        var result = resolveStyles(component, renderedElement);

        result.props[onHandlerName]();
        result.props[offHandlerName]();

        expect(originalOffHandler).toBeCalled();

        result = resolveStyles(component, {props: {style: style}});
        expect(result.props.style.background).toEqual('blue');
      });
    }

  }

});
