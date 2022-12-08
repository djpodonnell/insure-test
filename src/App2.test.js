/**
* @jest-environment node
*/

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import jwksClient from "jwks-rsa";
import createJWKSMock, { JWKSMock } from 'mock-jwks';
import jwt, { TokenExpiredError } from "jsonwebtoken";

const client = jwksClient({
jwksUri: "https://MYAUTH0APP.auth0.com/.well-known/jwks.json",
});
const jwks = createJWKSMock("https://MYAUTH0APP.auth0.com/");

beforeEach(() => {
jwks.start();
});

afterEach(() => {
jwks.stop();
});

const verifyAuth0Token = async token => {
return new Promise((resolve, reject) => {
jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
if (err) {
reject(err);
return;
}
decoded.email = "djpodonnell@gmail.com";
decoded.provider = "google";
resolve(decoded);
});
});
};

const getKey = (header, callback) => {
client.getSigningKey(header.kid, function(err, key) {
if (err) {
callback(err);
return;
}
const signingKey = key.getPublicKey();
callback(null, signingKey);
});
};

it('test app behaviour', async () => {
const token = jwks.token({});
const data = await verifyAuth0Token(token);
expect(data).not.toEqual({});
expect(data.email).toEqual("djpodonnell@gmail.com"); 
expect(data.provider).toEqual("google"); 
})

