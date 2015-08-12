var styleElement;
var exenv;

var {Component} = require('react/addons');

class MyComponent extends Component { }

describe('keyframes', () => {

  beforeEach(() => {
    styleElement = {
      textContent: '',
      sheet: {
        insertRule: sinon.spy(),
        cssRules: []
      }
    };

    sinon.stub(document, 'createElement', () => {
      return styleElement;
    });

    sinon.stub(document.head, 'appendChild');


    exenv = {
      canUseDOM: true,
      canUseEventListeners: true
    };

  });

  afterEach(() => {
    document.createElement.restore();
    document.head.appendChild.restore();
  });

  it('doesn\'t touch the DOM if DOM not available', () => {
    exenv = {
      canUseDOM: false,
      canUseEventListeners: false
    };

    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });

    expect(document.createElement).not.to.have.been.called;
    expect(document.head.appendChild).not.to.have.been.called;

    var name = keyframes({}, MyComponent);

    expect(name.length).to.be.greaterThan(0);
  });

  it('doesn\'t touch the DOM if animation not supported (IE9)', () => {
    var Prefixer = require('__mocks__/prefixer.js');
    Prefixer.__setNextPrefixedPropertyName(false);
    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': Prefixer
    });

    expect(document.createElement).not.to.have.been.called;
    expect(document.head.appendChild).not.to.have.been.called;

    var name = keyframes({}, MyComponent);

    expect(name.length).to.be.greaterThan(0);
  });

  it('returns a name for the keyframes', () => {
    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    var name = keyframes({}, MyComponent);
    expect(name.length).to.be.greaterThan(0);
  });

  it('does not always require a component', () => {
    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    var name = keyframes({});
    expect(name.length).to.be.greaterThan(0);
  });

  it('prefixes @keyframes if needed', () => {
    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    var name = keyframes({}, MyComponent);

    expect(styleElement.sheet.insertRule.lastCall.args).to.deep.equal([
      '@-webkit-keyframes ' + name + ' {\n\n}\n',
      0
    ]);
  });

  it('doesn\'t prefix @keyframes if not needed', () => {
    styleElement.sheet.cssRules = [{cssText: 'blah'}];
    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    var name = keyframes({}, MyComponent);

    expect(styleElement.sheet.insertRule.lastCall.args).to.deep.equal([
      '@keyframes ' + name + ' {\n\n}\n',
      1
    ]);
  });

  it('serializes keyframes', () => {
    var keyframes = require('inject?-./create-markup-for-styles!keyframes.js')({
      'exenv': exenv,
      './prefixer': require('__mocks__/prefixer.js')
    });
    var name = keyframes({
      from: {
        width: 100
      },
      to: {
        width: 200
      }
    }, MyComponent);

    expect(styleElement.sheet.insertRule.lastCall.args).to.deep.equal([
`@-webkit-keyframes ${name} {
  from {
    width: 100;
  }
  to {
    width: 200;
  }
}
`,
      0
    ]);
  });
});
