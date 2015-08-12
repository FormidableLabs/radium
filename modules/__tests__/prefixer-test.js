var browserPrefix = '';
var mockStyle = {};

var {Component} = require('react/addons');

class MyComponent extends Component { }

describe('Prefixer', () => {
  var exenv;

  beforeEach(() => {
    browserPrefix = '';
    mockStyle = {};

    sinon.stub(document, 'createElement', () => {
      return {style: mockStyle};
    });
    sinon.stub(window, 'getComputedStyle', () => {
      return [browserPrefix + 'transform'];
    });

    exenv = {
      canUseDOM: true,
      canUseEventListeners: true
    };
  });

  afterEach(() => {
    document.createElement.restore();
    window.getComputedStyle.restore();
  });

  it('detects Firefox prefix', () => {
    browserPrefix = '-moz-';
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.cssPrefix).to.equal('-moz-');
    expect(Prefixer.jsPrefix).to.equal('Moz');
  });

  it('detects IE prefix', () => {
    browserPrefix = '-ms-';
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.cssPrefix).to.equal('-ms-');
    expect(Prefixer.jsPrefix).to.equal('ms');
  });

  it('detects Opera prefix', () => {
    browserPrefix = '-o-';
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.cssPrefix).to.equal('-o-');
    expect(Prefixer.jsPrefix).to.equal('O');
  });

  it('detects Webkit prefix', () => {
    browserPrefix = '-webkit-';
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.cssPrefix).to.equal('-webkit-');
    expect(Prefixer.jsPrefix).to.equal('Webkit');
  });

  it('doesn\'t detect prefix if in server', () => {
    exenv = {
      canUseDOM: false,
      canUseEventListeners: false
    };

    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    var result = Prefixer.getPrefixedStyle(MyComponent, {display: 'flex'});

    expect(result).to.deep.equal({display: 'flex'});
    expect(Prefixer.cssPrefix).to.equal('');
    expect(Prefixer.jsPrefix).to.equal('');
    expect(document.createElement).not.to.have.been.called;
    expect(window.getComputedStyle).not.to.have.been.called;
  });

  it('uses unprefixed property if in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = { transform: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(MyComponent, {transform: 'foo'})).to.deep.equal({transform: 'foo'}
    );
  });

  it('caches property and value checks', () => {
    browserPrefix = '-webkit-';
    var transformGetter = sinon.stub().returns('foo');
    mockStyle = {
      get transform () { return transformGetter(); },
      set transform (value) { }
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    Prefixer.getPrefixedStyle(MyComponent, {transform: 'foo'});
    Prefixer.getPrefixedStyle(MyComponent, {transform: 'foo'});
    expect(transformGetter).to.have.been.calledOnce;
  });

  it('ignores property if not in style object', () => {
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    mockStyle = {};
    expect(Prefixer.getPrefixedStyle(MyComponent, {transform: 'foo'})).to.deep.equal({});
  });

  it('uses prefixed property if unprefixed not in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = { WebkitTransform: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {transform: 'foo'}
      )
    ).to.deep.equal({WebkitTransform: 'foo'});
  });

  it('uses alternative properties if no others available', () => {
    browserPrefix = '-moz-';
    mockStyle = { MozBoxFlex: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {flex: 1}
      )
    ).to.deep.equal({MozBoxFlex: 1});
  });

  it('unprefixes values before checking isUnitlessNumber to avoid px addition', () => {
    browserPrefix = '-moz-';
    mockStyle = { MozBoxFlex: '1', lineHeight: 2 };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {MozBoxFlex: 1, lineHeight: 2}
      )
    ).to.deep.equal({MozBoxFlex: 1, lineHeight: 2});
  });

  it('uses prefixed property if both in style object', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      transform: '',
      WebkitTransform: ''
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {transform: 'foo'}
      )
    ).to.deep.equal({WebkitTransform: 'foo'});
  });

  it('uses unprefixed value if setter works', () => {
    browserPrefix = '-webkit-';
    mockStyle = { transform: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {transform: 'foo'}
      )
    ).to.deep.equal({transform: 'foo'});
  });

  it('ignores unsupported values', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      get transform () { return ''; },
      set transform (value) { }
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {transform: 'foo'}
      )
    ).to.deep.equal({transform: 'foo'});
  });

  it('ignores number values', () => {
    mockStyle = { lineHeight: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {lineHeight: 2}
      )
    ).to.deep.equal({lineHeight: 2});
  });

  it('ignores numbers with units', () => {
    mockStyle = { lineHeight: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {lineHeight: '2em'}
      )
    ).to.deep.equal({lineHeight: '2em'});
  });

  it('ignores null values', () => {
    mockStyle = { lineHeight: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(MyComponent, {lineHeight: null}
      )
    ).to.deep.equal({lineHeight: null});
  });

  it('ignores undefined values', () => {
    mockStyle = { lineHeight: '' };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {lineHeight: undefined}
      )
    ).to.deep.equal({lineHeight: undefined}
    );
  });

  it('uses prefixed value if unprefixed setter fails and it works', () => {
    browserPrefix = '-webkit-';
    var flexValue = '';
    mockStyle = {
      get display () { return flexValue; },
      set display (value) {
        if (value === '-webkit-flex') {
          flexValue = '-webkit-flex';
        } else {
          flexValue = '';
        }
      }
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {display: 'flex'}
      )
    ).to.deep.equal({display: '-webkit-flex'});
  });

  it('uses alternative value if all others fail and it works', () => {
    browserPrefix = '-webkit-';
    var flexValue = '';
    mockStyle = {
      get display () { return flexValue; },
      set display (value) {
        if (value === '-webkit-box') {
          flexValue = '-webkit-box';
        } else {
          flexValue = '';
        }
      }
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(
        MyComponent, {display: 'flex'}
      )
    ).to.deep.equal({display: '-webkit-box'});
  });

  it('uses fallback in value array if first value fails and it works', () => {
    browserPrefix = '-webkit-';
    var flexValue = '';
    mockStyle = {
      get color () { return flexValue; },
      set color (value) {
        if (value === '#fff') {
          flexValue = '#fff';
        } else {
          flexValue = '';
        }
      }
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(MyComponent, {color: ['rgba(255, 255, 255, .5)', '#fff']})
    ).to.deep.equal({color: '#fff'});
  });

  it('uses first fallback value if none work even if it is numeric', () => {
    mockStyle = {height: 'auto'};
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(MyComponent, {height: [400, 'calc(100vh - 100px)']})
    ).to.deep.equal({height: '400px'});
    expect(
      Prefixer.getPrefixedStyle(MyComponent, {height: ['500px', 'calc(100vh - 100px)']})
    ).to.deep.equal({height: '500px'});
  });

  it('adds px to properties requiring units', () => {
    mockStyle = {height: 'auto'};
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {height: 400})).to.deep.equal({height: '400px'});
  });

  it('doesn\'t add px to properties requiring units if value is 0', () => {
    mockStyle = {height: 'auto'};
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {height: 0})).to.deep.equal({height: 0});
  });

  it('doesn\'t add px to properties not requiring units', () => {
    mockStyle = {zoom: '0'};
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {zoom: 4})).to.deep.equal({zoom: 4});
  });

  it('converts non-strings to strings', () => {
    mockStyle = {color: 'inherit'};
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    var colorHelper = {
      toString () {
        return 'white';
      }
    };
    expect(Prefixer.getPrefixedStyle(MyComponent, {color: colorHelper}))
      .to.deep.equal({color: 'white'});
  });

  it('uses dash-case if mode is css', () => {
    mockStyle = {
      borderWidth: '1px'
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {borderWidth: '1px'}, 'css')).to.deep.equal(
      {'border-width': '1px'}
    );
  });

  it('uses dash-case if mode is css and in server', () => {
    exenv = {
      canUseDOM: false,
      canUseEventListeners: false
    };

    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {borderWidth: '1px'}, 'css')).to.deep.equal(
      {'border-width': '1px'}
    );
  });

  it('uses first value in fallback array if in server', () => {
    exenv = {
      canUseDOM: false,
      canUseEventListeners: false
    };

    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(
      Prefixer.getPrefixedStyle(MyComponent, {color: ['rgba(255, 255, 255, .5)', '#fff']})
    ).to.deep.equal({color: 'rgba(255, 255, 255, .5)'});
  });

  it('uses dash-prefix if mode is css', () => {
    browserPrefix = '-webkit-';
    mockStyle = {
      WebkitBorderWidth: ''
    };
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {borderWidth: '1px'}, 'css')).to.deep.equal(
      {'-webkit-border-width': '1px'}
    );
  });

  /* eslint-disable no-console */
  it('doesn\'t warn if value is null or undefined', () => {
    mockStyle = {
      height: null
    };

    sinon.stub(console, 'warn');
    var Prefixer = require('inject!prefixer.js')({'exenv': exenv});
    expect(Prefixer.getPrefixedStyle(MyComponent, {height: null})).to.deep.equal(
      {height: null}
    );
    expect(Prefixer.getPrefixedStyle(MyComponent, {height: undefined})).to.deep.equal(
      {height: undefined}
    );
    expect(console.warn).not.to.have.been.called;
    console.warn.restore();
  });
  /* eslint-enable no-console */
});
