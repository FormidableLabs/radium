import Color from 'color';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestUtils from 'react-dom/test-utils';

export function getRenderOutput(element) {
  const renderer = new ShallowRenderer();
  renderer.render(element);
  return renderer.getRenderOutput();
}

export function getElement(output, tagName) {
  return ReactDOM.findDOMNode(
    TestUtils.findRenderedDOMComponentWithTag(output, tagName)
  );
}

export function getElements(output, tagName) {
  return TestUtils.scryRenderedDOMComponentsWithTag(output, tagName).map(
    component => ReactDOM.findDOMNode(component)
  );
}

function cleanCSS(css) {
  return css.replace(/\s*\n\s*/g, '').replace(/\s*([{};:,])\s*/g, '$1');
}

export function expectCSS(styleElement, css) {
  // strip newlines and excess whitespace from both to normalize browsers.
  // IE9, for instance, does not include new lines in innerText.
  // Also allows us to write our expected CSS cleanly, without worring about the
  // format of the actual output.
  expect(cleanCSS(styleElement.innerText)).to.equal(cleanCSS(css));
}

export function expectColor(actual, expected) {
  expect(Color(actual).hex()).to.equal(Color(expected).hex());
}

export function createEsClass(renderFn) {
  class Composed extends Component {
    render() {
      return renderFn() || <div />;
    }
  }

  return Composed;
}
