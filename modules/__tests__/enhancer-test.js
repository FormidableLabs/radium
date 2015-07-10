var resolveStyles = sinon.spy(require('resolve-styles.js'));
var Enhancer = require('inject!enhancer.js')({
  './resolve-styles.js': resolveStyles
});

var {Component} = require('react');

describe('Enhancer', () => {
  it('receives the given props', () => {
    class Composed extends Component {
      constructor (props) {
        super(props);
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced({foo: 'bar'});

    expect(instance.props).to.deep.equal({foo: 'bar'});
  });

  it('calls existing render function, then resolveStyles', () => {
    var renderMock = sinon.spy();
    class Composed extends Component {
      render () {
        renderMock();
        return null;
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.render();

    expect(renderMock).to.have.been.called;
    expect(resolveStyles).to.have.been.called;
  });

  it('calls existing constructor only once', () => {
    var constructorMock = sinon.spy();
    class Composed extends Component {
      constructor () {
        super();
        constructorMock();
      }
    }
    var Enhanced = Enhancer(Composed);

    new Enhanced(); // eslint-disable-line no-new

    expect(constructorMock).to.have.been.calledOnce;
  });

  it('refers to the existing displayName', () => {
    class Composed extends Component {}
    Composed.displayName = 'Composed';

    var Enhanced = Enhancer(Composed);

    expect(Enhanced.displayName).to.contain(Composed.displayName);
  });

  it('calls existing componentWillUnmount function', () => {
    var existingComponentWillUnmount = sinon.spy();
    class Composed extends Component {
      componentWillUnmount () {
        existingComponentWillUnmount();
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.componentWillUnmount();

    expect(existingComponentWillUnmount).to.have.been.called;
  });

  it('removes mouse up listener on componentWillUnmount', () => {
    var removeMouseUpListener = sinon.spy();
    class Composed extends Component {
      constructor () {
        super();
        this._radiumMouseUpListener = { remove: removeMouseUpListener };
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.componentWillUnmount();

    expect(removeMouseUpListener).to.have.been.called;
  });

  it('removes media query listeners on componentWillUnmount', () => {
    var mediaQueryListenersByQuery = {
      '(min-width: 1000px)': { remove: sinon.spy() },
      '(max-width: 600px)': { remove: sinon.spy() },
      '(min-resolution: 2dppx)': { remove: sinon.spy() }
    };
    class Composed extends Component {
      constructor () {
        super();
        this._radiumMediaQueryListenersByQuery = mediaQueryListenersByQuery;
      }
    }
    var Enhanced = Enhancer(Composed);

    var instance = new Enhanced();
    instance.componentWillUnmount();

    Object.keys(mediaQueryListenersByQuery).forEach(function (key) {
      expect(mediaQueryListenersByQuery[key].remove).to.have.been.called;
    });
  });
});
