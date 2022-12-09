 import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
 var jwksRsa = require('jwks-rsa');
 import createJWKSMock, { JWKSMock } from 'mock-jwks';
 import jwt, { TokenExpiredError } from "jsonwebtoken";
 
 const client = new jwksRsa.JwksClient({
   jwksUri: "https://MYAUTH0APP.auth0.com/.well-known/jwks.json",
 });
 const jwks = createJWKSMock("https://MYAUTH0APP.auth0.com/");

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
 
export default verifyAuth0Token;