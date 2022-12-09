/**
 * @jest-environment jsdom
 */

import TestRenderer from 'react-test-renderer';
import App from './App';
import verifyAuth0Token from './mockAuth';
import createJWKSMock, { JWKSMock } from 'mock-jwks';
import 'setimmediate';

let hello = require('hellojs/dist/hello.all.js')
hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
}, {redirect_uri: 'http://localhost:3000'});
let openCount = 0;

const jwks = createJWKSMock("https://MYAUTH0APP.auth0.com/");

  beforeEach(() => {
    jwks.start();
  });

  afterEach(() => {
    jwks.stop();
  });

it('test app behaviour', async () => {
  global.window.open = () => {
    openCount++;
  }; 
    const testRenderer = TestRenderer.create(
        <App />
      );
  const testInstance = testRenderer.root;
  const buttons = testInstance.findAllByProps({ id: 'googleButton' });
  expect(buttons.length).toBe(1); 
  const googleButton = buttons[0];
  let tree = testRenderer.toJSON();
  expect(tree).toMatchSnapshot();
});

it('test already logged in', async () => { 
  const authService = require('./authService');
  const spyOnHello = jest.spyOn(authService , 'helloGoogle');

  global.window.open = () => {
    openCount++;
  }; 

 const token = await jwks.token({});
 const data = await verifyAuth0Token(token);
 expect(data).not.toEqual({});
 expect(data.email).toEqual("djpodonnell@gmail.com"); 
 expect(data.provider).toEqual("google");

  const testRenderer = TestRenderer.create(
      <App />
    );
  const testInstance = testRenderer.root;
  const buttons = testInstance.findAllByProps({ id: 'googleButton' });
  expect(buttons.length).toBe(1); 
  const googleButton = buttons[0];
  googleButton.props.onClick();
  expect(openCount).toEqual(1);
  expect(spyOnHello).toHaveBeenCalledTimes(1);
});