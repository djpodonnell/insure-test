let hello = require('hellojs/dist/hello.all.js')

hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
  windows: '64d87118-92ad-4898-85eb-a05dc8af6e49',
  facebook: ''
}, {redirect_uri: 'http://localhost:3000'});

export function helloGoogle(){
    hello('google').login({
        scope: 'email',
        force: false,
        response_type: 'token'
      });  
  }

  export function helloWindows(){
    hello('windows').login({
      scope: 'email',
      force: true
    });
  }

  export function helloFacebook(){
    hello('facebook').login({
      scope: 'email',
      force: true
  });
  }

  export function getCount(user,provider) {
    return new Promise((resolve, reject) => {
      var url = 'http://localhost:3001/hello/';
        url += '?param1='+user+'&param2='+provider;
        fetch(url)
        .then((response) => {
          response.json().then((resp) => {
            resolve(resp.countValue);
          });
        })
        .then((returnedData) => {
        })
        .catch((err) => {
            reject(err.message);
        });
    })
  }

  export function insertRow(user,provider) {
    var url = 'http://localhost:3001/insert/';
    url += '?param1='+user+'&param2='+provider;
    return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((returnedData) => {}).catch((err) => {
      return err.message;
  });
  }

  export function getAuthResponse(provider) {
    return hello(provider).getAuthResponse();
  }

  export function getNetworkResponse(provider){
    return hello(provider).api('/me');
  }

  export function loggedIn(){
    return hello.on('auth.login');
  }

  export function updateCount(user,provider,count) {
    var url = 'http://localhost:3001/update/';
    url += '?param1='+user+'&param2='+provider+'&param3='+count;
    return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((returnedData) => {
    }).catch((err) => {
      return err.message;
  });
  }