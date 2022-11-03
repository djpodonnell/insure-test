import React,{ Component } from 'react';

let hello = require('hellojs/dist/hello.all.js')

hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
  windows: '136e980d-d4ae-4257-8f2d-7f71f34625f5'
}, {redirect_uri: 'http://localhost:3000'});

class App extends Component {
  state = {
    isLogin:false,
    update:false,
    currentData:[],
    rendered:false,
    insertMode: false
 }

 loginGoogle = () => {
  hello('google').login({
    scope: 'email',
    force: true
  });
}

loginWindows = () => {
  hello('windows').login({
    scope: 'email',
    force: true
  });
}

  logoutApp = () => {
    hello('google').logout();
    hello('windows').logout();
    this.setState({isLogin:false});
  }

  componentDidMount() {
    var updated = this.state.update;
    this.setState({rendered:true});
    this.interval = setInterval(() => this.setState({ update: !updated }), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getCount(user,provider) {
    // Get the current 'global' time from an API using Promise
    return new Promise((resolve, reject) => {
      var url = 'http://localhost:3001/hello/';
        url += '?param1='+user+'&param2='+provider;
        fetch(url)
        .then((response) => {
          console.log("resp2 = "+Object.keys(response));
        })
        .then((returnedData) => {
          console.log("ret dat = "+returnedData+" at "+Date.now());
          //if(returnedData!== undefined) {
            resolve(returnedData);
          //}
        })
        .catch((err) => {
            console.log(err.message);
            reject(0);
        });
    })
  }

  handleCount(email,provider) {
    console.log("get 2nd count");
    this.getCount(email,provider).then(count => {
      console.log("2nd count = "+count+" at "+Date.now());
      var userName = "You have logged into user "+email+", provider "
      +provider+" "+count+" times.";
      if(document.getElementById("helloname") !== null) {
          document.getElementById("helloname").innerHTML = userName;
      }
    });
    
  }

  insertRow(user,provider) {
    var url = 'http://localhost:3001/insert/';
    url += '?param1='+user+'&param2='+provider;
    return fetch(url)
    .then((response) => {
      console.log("insert finished");
      return response.json();
    })
    .then((returnedData) => {}).catch((err) => {
      console.log(err.message);
      return err.message;
  });
  }

  updateCount(user,provider,count) {
    var url = 'http://localhost:3001/update/';
    url += '?param1='+user+'&param2='+provider+'&param3='+count;
    return fetch(url)
    .then((response) => {
      console.log("update finished");
      return response.json();
    })
    .then((returnedData) => {
      this.setState({insertMode: false});
    }).catch((err) => {
      console.log(err.message);
      this.setState({insertMode: true});
      return err.message;
  });
  }

    isOnline(session) {
      var self = this;
      var currentTime = (new Date()).getTime() / 1000;

      if(!this.state.rendered) {
        return;
      }
      if(session != null) {
        hello.on('auth.login', function(auth) {
          // Call user information, for the given network
          hello(auth.network).api('/me').then(function(r) {

            self.getCount(r.email,auth.network).then(count => {
              if(self.state.insertMode) {
                return;
              }

              console.log("first count = "+count+" at "+Date.now());
            
              //if(count === undefined || count === 0) {
                console.log("inserting = "+self);
                self.setState({insertMode: true});
                var user = r.email;
                var provider = auth.network;
                self.insertRow(r.email,auth.network).then(function(){
                  var self2 = self;
                  self2.handleCount(user,provider);
                });
              /* else {
                var c = count;
                console.log("adding "+c);
                /*self.updateCount(r.email,auth.network,c++).then(function(r,auth) {
                  var self2 = self;
                  self2.handleCount(r.email,auth.network)
                });
              }*/
            });
          });
      });
      }
      
      return session && session.access_token && session.expires > currentTime;
    };

  render() {
    const goog = hello('google').getAuthResponse();
    const win = hello('windows').getAuthResponse();
    const onlineGoogle = this.isOnline(goog);
    const onlineWin = this.isOnline(win);
    //console.log('win = '+online(win));
    
    return (
      <div className="App">
        {onlineGoogle || onlineWin ? (<div>
          <p id="helloname"></p>
          <button onClick={()=>this.logoutApp()}>Logout</button>
          </div>) : 
        (<div>
          <button onClick={()=>this.loginGoogle()}>Google Login</button>
        <button onClick={()=>this.loginWindows()}>Windows Login</button>
        </div>)}
      </div>
    )
  }
}

export default App;
