/**
 * @jest-environment jsdom
 * 
 */

import TestRenderer from 'react-test-renderer';
import App from './App';
import 'setimmediate';
import React from 'react';

let hello = require('hellojs/dist/hello.all.js')
hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
}, {redirect_uri: 'http://localhost:3000'});

const authService = require('./authService');

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