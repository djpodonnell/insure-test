 import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
 var jwksRsa = require('jwks-rsa');
 import createJWKSMock, { JWKSMock } from 'mock-jwks';
 import jwt, { TokenExpiredError } from "jsonwebtoken";
 import Decoder from './Decoder';
 
 const client = new jwksRsa.JwksClient({
   jwksUri: "https://MYAUTH0APP.auth0.com/.well-known/jwks.json"
 });
 const jwks = createJWKSMock("https://MYAUTH0APP.auth0.com/");

     const verifyAuth0Token = async(token:any) : Promise<Decoder> => {
      let decoder = new Decoder("djpodonnell@gmail.com","google");
        return new Promise<Decoder>((resolve,reject) => {
          jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err:any , decoded:any) => {
            if (err) {
              reject(err);
            }
          resolve(decoder);
        });
     });
    };
 
   const getKey = (header:any, callback:any) => {
     client.getSigningKey(header.kid, function(err:any, key:any) {
       if (err) {
         callback(err);
         return;
       }
       const signingKey = key.getPublicKey();
   
       callback(null, signingKey);
     });
   };
 
export default verifyAuth0Token;