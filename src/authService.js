export function helloGoogle(){
    let hello = require('hellojs/dist/hello.all.js')

    hello.init({
        google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com'
      }, {redirect_uri: 'http://localhost:3000'});

    hello('google').login({
        scope: 'email',
        force: true
      });
  }