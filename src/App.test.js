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

const jwks = createJWKSMock("https://MYAUTH0APP.auth0.com/");
const authService = require('./authService');

  beforeEach(() => {
    jwks.start();
  });

  afterEach(() => {
    jwks.stop();
  });

it('test app behaviour', async () => {
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

it('test login attempt', async () => { 
  const spyOnHello = jest.spyOn(authService , 'helloGoogle');
  const jsdomAlert = window.open;  
  window.open = () => {}; 

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
  expect(spyOnHello).toHaveBeenCalledTimes(1);
});

it('google login', async () => { 
  const email = {
    email: 'djpodonnell@gmail.com'
  };

  var currentTime = (new Date()).getTime() / 1000;
  const obj = {
    provider: 'google',
    access_token: 'abcd',
    expires: currentTime+10000
  };
  
  
  const spyOnAuth = jest.spyOn(authService , 'getAuthResponse').mockReturnValue(obj);
  const testRenderer = TestRenderer.create(
    <App />
  );
  const testInstance = testRenderer.root;
  expect(spyOnAuth).toHaveBeenCalled();
  const buttons = testInstance.findAllByProps({ id: 'googleButton' });
  expect(buttons.length).toBe(0); 
  const labels = testInstance.findAllByProps({ id: 'helloname' });
  expect(labels.length).toBe(1); 
  const out= testInstance.findAllByProps({ id: 'logoutButton' });
  expect(out.length).toBe(1); 
});

it('google login fail', async () => { 
  const obj = {
    network: 'google'
  };
  
  const spyOnAuth = jest.spyOn(authService , 'getAuthResponse').mockReturnValue(obj);
  const testRenderer = TestRenderer.create(
    <App />
  );
  const testInstance = testRenderer.root;
  expect(spyOnAuth).toHaveBeenCalled();
  const buttons = testInstance.findAllByProps({ id: 'googleButton' });
  expect(buttons.length).toBe(1); 
  const labels = testInstance.findAllByProps({ id: 'helloname' });
  expect(labels.length).toBe(0); 
  const out= testInstance.findAllByProps({ id: 'logoutButton' });
  expect(out.length).toBe(0); 
});