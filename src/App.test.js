/**
 * @jest-environment jsdom
 */

import TestRenderer from 'react-test-renderer';
import App from './App';

it('test app behaviour', () => {
    const testRenderer = TestRenderer.create(
        <App />
      );
  const testInstance = testRenderer.root;
  const buttons = testInstance.findAllByProps({ id: 'googleButton' });
  expect(buttons.length).toBe(1); 
  const googleButton = buttons[0];
  let tree = testRenderer.toJSON();
  expect(tree).toMatchSnapshot();

  googleButton.props.onClick();
});