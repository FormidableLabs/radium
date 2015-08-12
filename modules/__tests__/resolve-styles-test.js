var React = require('react/addons');
var MouseUpListener = require('mouse-up-listener.js');
var objectAssign = require('object-assign');
var resolveStyles = require('inject?-./get-state&-./config!resolve-styles.js')({
  'exenv': require('__mocks__/exenv.js'),
  './prefixer': require('__mocks__/prefixer.js')
});
var Config = require('config.js');

var genComponent = function () {
  return {
    setState: sinon.spy(function (newState) {
      objectAssign(this.state, newState);
    }),
    state: {}
  };
};

// http://stackoverflow.com/a/25395068/13932
var permutate = function (arr) {
  var permutations = [];
  if (arr.length === 1) {
    return [arr];
  }

  for (var i = 0; i < arr.length; i++) {
    var subPerms = permutate(arr.slice(0, i).concat(arr.slice(i + 1)));
    for (var j = 0; j < subPerms.length; j++) {
      subPerms[j].unshift(arr[i]);
      permutations.push(subPerms[j]);
    }
  }

  return permutations;
};

var getChildrenArray = function (children) {
  var childrenArray = [];
  React.Children.forEach(children, function (child) {
    childrenArray.push(child);
  });
  return childrenArray;
};

describe('resolveStyles', function () {

  beforeEach(function () {
    MouseUpListener.subscribe = sinon.spy();
  });

  describe('no-op behavior', function () {

    it('handles null rendered element', function () {
      var component = genComponent();

      resolveStyles(component, null);
    });

    it('doesn\'t explode', function () {
      var component = genComponent();
      var renderedElement = <div />;

      var result = resolveStyles(component, renderedElement);

      expect(result).to.equal(renderedElement);
      expect(result.props).to.equal(renderedElement.props);
    });

    it('passes through normal style objects', function () {
      var component = genComponent();
      var renderedElement = <div style={{color: 'blue'}} />;

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).to.deep.equal(renderedElement.props.style);
    });

    it('passes through normal style objects of children', function () {
      var component = genComponent();
      var style = {color: 'blue'};
      var renderedElement = (
        <div>
          <div style={style} />
        </div>
      );

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.deep.equal(style);
    });

    it('doesn\'t wrap string children in spans', function () {
      var component = genComponent();
      var renderedElement = <div>Hello</div>;

      var result = resolveStyles(component, renderedElement);
      expect(result.props.children).to.equal('Hello');
    });

    it('doesn\'t wrap number children in spans', function () {
      var component = genComponent();
      var renderedElement = <div>{88347}</div>;

      var result = resolveStyles(component, renderedElement);
      expect(result.props.children).to.equal(88347);
    });

    it('ignores invalid children', function () {
      var component = genComponent();

      // JSX won't let this through, so do it with a plain object instead
      var renderedElement = {props: {
        children: [null]
      }};

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);

      expect(children[0]).to.be.null;
    });

    it('only processes an element once', function () {
      sinon.spy(React, 'cloneElement');

      var component = genComponent();
      var renderedElement = (
        <div style={[
          {background: 'white'},
          {color: 'blue'}
        ]} />
      );

      var result = resolveStyles(component, renderedElement);
      result = resolveStyles(component, result);

      expect(result.props.style).to.deep.equal({
        background: 'white',
        color: 'blue'
      });

      expect(React.cloneElement).to.have.been.calledOnce;

      React.cloneElement.restore();
    });

  });

  describe('style array', function () {

    it('merges an array of style objects', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={[
          {background: 'white'},
          {color: 'blue'}
        ]} />
      );

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).to.deep.equal({
        background: 'white',
        color: 'blue'
      });
    });

    it('skips falsy and non-object entries', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={[
          {background: 'white'},
          false,
          null,
          ''.someUndefinedVar,
          '',
          [1, 2, 3],
          {color: 'blue'}
        ]} />
      );

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).to.deep.equal({
        background: 'white',
        color: 'blue'
      });
    });

    it('overwrites earlier styles with later ones', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={[
          {background: 'white'},
          {background: 'blue'}
        ]} />
      );

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).to.deep.equal({
        background: 'blue'
      });
    });

    it('merges nested special styles', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={[
          {':hover': { background: 'white'}},
          {':hover': {color: 'blue'}}
        ]} />
      );

      var result = resolveStyles(component, renderedElement);
      result.props.onMouseEnter();
      result = resolveStyles(component, renderedElement);

      expect(result.props.style).to.deep.equal({
        background: 'white',
        color: 'blue'
      });
    });

  });

  var createPseduoStyleTests = function (pseudo, onHandlerName, offHandlerName) {

    it('strips special styles if not applied', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};
      var renderedElement = <div style={style} />;

      var result = resolveStyles(component, renderedElement);

      expect(result.props.style).to.deep.equal({background: 'blue'});
    });

    it('adds appropriate handlers for ' + pseudo + ' styles', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};
      var renderedElement = <div style={style} />;

      var result = resolveStyles(component, renderedElement);

      expect(typeof result.props[onHandlerName]).to.equal('function');
      if (offHandlerName) {
        expect(typeof result.props[offHandlerName]).to.equal('function');
      }
    });

    it('adds ' + pseudo + ' styles ' + onHandlerName, function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};
      var renderedElement = <div style={style} />;

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('blue');

      result.props[onHandlerName]();

      expect(component.setState).to.have.been.called;

      // Must create a new renderedElement each time, same as React, since
      // resolveStyles mutates
      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');
    });

    it('throws if multiple elements have the same key', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      // Use ref instead of key here because React.Children.map will discard
      // the duplicate keyed element.
      var renderedElement = (
        <div>
          <div ref="foo" style={style} />
          <div ref="foo" style={style} />
        </div>
      );

      expect(function () {
        resolveStyles(component, renderedElement);
      }).to.throw();
    });

    it('throws if multiple elements have no key', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = (
        <div>
          <div style={style} />
          <div style={style} />
        </div>
      );

      expect(function () {
        resolveStyles(component, renderedElement);
      }).to.throw();
    });

    it('adds ' + pseudo + ' styles to correct element by key', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = (
        <div>
          <div key="foo" />
          <div key="bar" style={style} />
        </div>
      );

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.be.undefined;
      expect(children[1].props.style.background).to.equal('blue');

      children[1].props[onHandlerName]();

      result = resolveStyles(component, renderedElement);
      children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.be.undefined;
      expect(children[1].props.style.background).to.equal('red');
    });

    it('adds ' + pseudo + ' styles to correct element by ref', function () {
      var component = genComponent();
      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = (
        <div>
          <div ref="foo" />
          <div ref="bar" style={style} />
        </div>
      );

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.be.undefined;
      expect(children[1].props.style.background).to.equal('blue');

      children[1].props[onHandlerName]();

      result = resolveStyles(component, renderedElement);
      children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.be.undefined;
      expect(children[1].props.style.background).to.equal('red');
    });

    if (offHandlerName) {
      it('removes ' + pseudo + ' styles ' + offHandlerName, function () {
        var component = genComponent();
        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};
        var renderedElement = <div style={style} />;

        var result = resolveStyles(component, renderedElement);

        result.props[onHandlerName]();

        result = resolveStyles(component, renderedElement);
        expect(result.props.style.background).to.equal('red');

        result.props[offHandlerName]();

        expect(component.setState).to.have.been.called;

        result = resolveStyles(component, renderedElement);
        expect(result.props.style.background).to.equal('blue');
      });

      it('doesn\'t mutate state', function () {
        var component = genComponent();
        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};
        var renderedElement = <div style={style} />;

        var result = resolveStyles(component, renderedElement);

        // Capturing a reference to the existing state is enough, since Radium
        // MUST return a new copy for shouldComponentUpdate.
        var previousState = component.state._radiumStyleState;
        result.props[onHandlerName]();
        // If they are still equal here, that means we mutated the existing
        // state, which will break shouldComponentUpdate.
        expect(component.state._radiumStyleState).not.to.equal(previousState);

        result = resolveStyles(component, renderedElement);

        previousState = component.state._radiumStyleState;
        result.props[offHandlerName]();
        expect(component.state._radiumStyleState).not.to.equal(previousState);
      });
    }

    it('calls existing ' + onHandlerName + ' handler', function () {
      var component = genComponent();
      var originalOnHandler = sinon.spy();

      var style = {background: 'blue'};
      style[':' + pseudo] = {background: 'red'};

      var renderedElement = <div style={style} />;
      renderedElement.props[onHandlerName] = originalOnHandler;

      var result = resolveStyles(component, renderedElement);

      result.props[onHandlerName]();

      expect(originalOnHandler).to.have.been.called;

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');
    });

    if (offHandlerName) {
      it('calls existing ' + offHandlerName + ' handler', function () {
        var component = genComponent();
        var originalOffHandler = sinon.spy();

        var style = {background: 'blue'};
        style[':' + pseudo] = {background: 'red'};
        style[offHandlerName] = originalOffHandler;

        var renderedElement = <div style={style} />;
        renderedElement.props[offHandlerName] = originalOffHandler;

        var result = resolveStyles(component, renderedElement);

        result.props[onHandlerName]();
        result.props[offHandlerName]();

        expect(originalOffHandler).to.have.been.called;

        result = resolveStyles(component, renderedElement);
        expect(result.props.style.background).to.equal('blue');
      });
    }

  };

  describe(':hover', function () {
    createPseduoStyleTests('hover', 'onMouseEnter', 'onMouseLeave');
  });

  describe(':focus', function () {
    createPseduoStyleTests('focus', 'onFocus', 'onBlur');
  });

  describe(':active', function () {
    createPseduoStyleTests('active', 'onMouseDown');

    it('subscribes to mouse up listener', function () {
      var component = genComponent();
      var renderedElement = <div style={{':active': {background: 'red'}}} />;

      resolveStyles(component, renderedElement);

      expect(MouseUpListener.subscribe).to.have.been.called;
    });

    it('adds active styles on mouse down', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = <div style={style} />;

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('blue');

      result.props.onMouseDown();


      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');
    });

    it('removes active styles on mouse up', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = <div style={style} />;

      var result = resolveStyles(component, renderedElement);

      result.props.onMouseDown();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');

      // tigger global mouseup handler
      MouseUpListener.subscribe.firstCall.args[0]();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('blue');
    });

    it('ignores mouse up if no active styles', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var renderedElement = <div style={style} />;

      var result = resolveStyles(component, renderedElement);

      result.props.onMouseDown();

      // tigger global mouseup handler
      MouseUpListener.subscribe.firstCall.args[0]();
      MouseUpListener.subscribe.firstCall.args[0]();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('blue');
    });

    it('calls existing onMouseDown handler', function () {
      var component = genComponent();
      var style = {
        background: 'blue',
        ':active': {background: 'red'}
      };
      var originalOnMouseDown = sinon.spy();
      var renderedElement = (
        <div
          onMouseDown={originalOnMouseDown}
          style={style}
        />
      );

      var result = resolveStyles(component, renderedElement);

      result.props.onMouseDown();

      expect(originalOnMouseDown).to.have.been.called;

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');
    });
  });

  describe('media queries', function () {
    beforeEach(function () {
      resolveStyles.__clearStateForTests();
    });

    it('listens for media queries', function () {
      var component = genComponent();
      var addListener = sinon.spy();
      var matchMedia = sinon.spy(function () {
        return {addListener: addListener};
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div style={{
          '@media (max-width: 400px)': {background: 'red'}
        }} />
      );

      resolveStyles(component, renderedElement);
      expect(matchMedia.lastCall.args[0]).to.equal('(max-width: 400px)');
      expect(addListener.lastCall.args[0]).to.be.a('function');
    });

    it('only listens once for a single element', function () {
      var component = genComponent();
      var addListener = sinon.spy();
      var matchMedia = sinon.spy(function () {
        return {addListener: addListener};
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div style={{
          '@media (max-width: 400px)': {background: 'red'}
        }} />
      );

      resolveStyles(component, renderedElement);
      resolveStyles(component, renderedElement);

      expect(matchMedia).to.have.been.calledOnce;
      expect(addListener).to.have.been.calledOnce;
    });

    it('listens once per component', function () {
      var component1 = genComponent();
      var component2 = genComponent();
      var addListener = sinon.spy();
      var matchMedia = sinon.spy(function () {
        return {addListener: addListener};
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div>
          <div
            key="first"
            style={{'@media (max-width: 400px)': {background: 'red'}}}
          />
          <div
            key="second"
            style={{'@media (max-width: 400px)': {background: 'red'}}}
          />
        </div>
      );

      resolveStyles(component1, renderedElement);
      resolveStyles(component2, renderedElement);

      expect(matchMedia).to.have.been.calledOnce;
      expect(addListener).to.have.been.calledTwice;
    });

    it('applies styles when media query matches', function () {
      var component = genComponent();
      var matchMedia = sinon.spy(function () {
        return {
          addListener: sinon.spy(),
          matches: true
        };
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div style={{
          background: 'blue',
          '@media (max-width: 400px)': {background: 'red'}
        }} />
      );

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');
    });

    it('merges nested pseudo styles', function () {
      var component = genComponent();
      var matchMedia = sinon.spy(function () {
        return {
          addListener: sinon.spy(),
          matches: true
        };
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div style={[
          {
            background: 'blue',
            ':hover': {
              background: 'green',
              color: 'green'
            },
            '@media (max-width: 400px)': {
              background: 'red',
              ':hover': {
                background: 'yellow'
              }
            }
          },
          {
            '@media (max-width: 400px)': {
              ':hover': {
                color: 'white'
              }
            }
          }
        ]} />
      );

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('red');

      result.props.onMouseEnter();

      result = resolveStyles(component, renderedElement);
      expect(result.props.style.background).to.equal('yellow');
      expect(result.props.style.color).to.equal('white');
    });

    it('calls component setState when media query changes', function () {
      var component1 = genComponent();
      var component2 = genComponent();
      var listeners = [];
      var addListener = sinon.spy(
        function (listener) {
          listeners.push(listener);
        }
      );
      var mql = {addListener: addListener};
      var matchMedia = sinon.spy(function () {
        return mql;
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div style={{
          background: 'blue',
          '@media (max-width: 400px)': {background: 'red'}
        }} />
      );

      resolveStyles(component1, renderedElement);
      resolveStyles(component2, renderedElement);

      listeners.forEach(function (listener) { listener(mql); });

      expect(component1.setState).to.have.been.called;
      expect(component2.setState).to.have.been.called;
    });

    it('saves listeners on component for later removal', function () {
      var component = genComponent();
      var mql = {
        addListener: sinon.spy(),
        removeListener: sinon.spy()
      };
      var matchMedia = sinon.spy(function () {
        return mql;
      });
      Config.setMatchMedia(matchMedia);

      var renderedElement = (
        <div style={{
          background: 'blue',
          '@media (max-width: 400px)': {background: 'red'}
        }} />
      );

      resolveStyles(component, renderedElement);

      Object.keys(component._radiumMediaQueryListenersByQuery).forEach(
        function (key) {
          component._radiumMediaQueryListenersByQuery[key].remove();
        }
      );

      expect(mql.removeListener).to.have.been.called;
    });
  });

  describe('multiple states triggered at once', function () {

    describe('applies pseudo styles in the defined order', function () {
      var component = genComponent();
      var stylePermutations = permutate([
        {name: ':active', style: {background: 'red'}},
        {name: ':focus', style: {background: 'yellow'}},
        {name: ':hover', style: {background: 'blue'}}
      ]);
      var onHandlerPermutations = permutate([
        'onFocus',
        'onMouseDown',
        'onMouseEnter'
      ]);

      var createMultiPseudoTest = function (pseudoStyles, onHandlers) {
        var name = 'applies pseudo styles in the defined order: ' +
          pseudoStyles.map(function (pseudo) { return pseudo.name; }).join(', ') +
          ' when handlers called in order: ' + onHandlers.join(', ');
        it(name, function () {
          var style = {};
          pseudoStyles.forEach(function (pseudo) {
            style[pseudo.name] = pseudo.style;
          });
          var renderedElement = <div style={style} />;

          var result = resolveStyles(component, renderedElement);

          onHandlers.forEach(function (onHandler) {
            result.props[onHandler]();
          });

          result = resolveStyles(component, renderedElement);

          expect(result.props.style.background).to.equal(
            pseudoStyles[pseudoStyles.length - 1].style.background
          );
        });
      };

      stylePermutations.forEach(function (pseudoStyles) {
        onHandlerPermutations.forEach(function (onHandlers) {
          createMultiPseudoTest(pseudoStyles, onHandlers);
        });
      });
    });
  });

  describe('React.Children.only', function () {
    it('doesn\'t break React.Children.only', function () {
      var component = genComponent();
      var renderedElement = <div><span /></div>;

      var result = resolveStyles(component, renderedElement);

      expect(React.Children.only(result.props.children)).to.be.ok;
    });

    it('doesn\'t break when only child isn\'t ReactElement', function () {
      var component = genComponent();
      var renderedElement = <div>Foo</div>;

      resolveStyles(component, renderedElement);
    });
  });

  describe('ReactComponentElement children', function () {
    it('doesn\'t resolve ReactComponentElement children', function () {
      var component = genComponent();
      class CustomComponent extends React.Component {}
      var style = {':hover': {}};
      var renderedElement = (
        <div>
          <CustomComponent style={style}/>
        </div>
      );

      var result = resolveStyles(component, renderedElement);
      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.deep.equal(style);
    });

    it('resolves ReactDOMElement children of ReactComponentElements', function () {
      var component = genComponent();
      class CustomComponent extends React.Component {}
      var style = [
        {background: 'white'},
        {color: 'blue'}
      ];
      var renderedElement = (
        <div style={style}>
          <CustomComponent style={style}>
            <div style={style} />
          </CustomComponent>
        </div>
      );

      var result = resolveStyles(component, renderedElement);
      expect(result.props.style).to.deep.equal({
        background: 'white',
        color: 'blue'
      });

      var children = getChildrenArray(result.props.children);
      expect(children[0].props.style).to.deep.equal(style);

      var componentChildren = getChildrenArray(children[0].props.children);
      expect(componentChildren[0].props.style).to.deep.equal({
        background: 'white',
        color: 'blue'
      });
    });
  });

  /* eslint-disable no-console */
  describe('warnings', function () {
    beforeEach(function () {
      sinon.stub(console, 'warn');
    });

    afterEach(function () {
      console.warn.restore();
      process.env.NODE_ENV = null;
    });

    it('warns when mixing longhand and shorthand properties', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={{
          border: '1px solid black',
          borderWidth: '0 1px 1px 1px'
        }} />
      );

      resolveStyles(component, renderedElement);

      expect(console.warn).to.have.been.called;
      expect(console.warn.firstCall.args[0].indexOf('border'))
        .to.be.greaterThan(0);
    });

    it('warns when mixing longhand and shorthand properties in nested styles', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={{
          ':hover': {
            border: '1px solid black',
            borderWidth: '0 1px 1px 1px'
          }
        }} />
      );

      resolveStyles(component, renderedElement);

      expect(console.warn).to.have.been.called;
      expect(console.warn.firstCall.args[0].indexOf('border'))
        .to.be.greaterThan(0);
    });

    it('does not warn when mixing border and borderRadius', function () {
      var component = genComponent();
      var renderedElement = (
        <div style={{
          border: '1px solid black',
          borderRadius: '5px'
        }} />
      );

      resolveStyles(component, renderedElement);

      expect(console.warn).to.not.have.been.called;
    });

    it('does not throw when passed a falsy entry value', function () {
      var component = genComponent();
      var renderedElement = <div style={{height: null }} />;

      expect(function () {
        resolveStyles(component, renderedElement);
      }).to.not.throw();
    });
  });
  /* eslint-enable no-console */
});
