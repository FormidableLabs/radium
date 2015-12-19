import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

export function getRenderOutput(element) {
  const renderer = TestUtils.createRenderer();
  renderer.render(element);
  return renderer.getRenderOutput();
}

export function getElement(output, tagName) {
  return ReactDOM.findDOMNode(
    TestUtils.findRenderedDOMComponentWithTag(output, tagName)
  );
}
