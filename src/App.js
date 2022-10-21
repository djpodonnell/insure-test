import React,{ Component } from 'react';

let hello = require('hellojs/dist/hello.all.js')

hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
  windows: '136e980d-d4ae-4257-8f2d-7f71f34625f5'
}, {redirect_uri: 'http://localhost:3000'});

class App extends Component {
  state = {
    isLogin:false,
    update:true
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
    this.interval = setInterval(() => this.setState({ update: !updated }), 3000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const goog = hello('google').getAuthResponse();
    const win = hello('windows').getAuthResponse();
    var userName = "";
    var online = function(session) {
      var currentTime = (new Date()).getTime() / 1000;
      if(session != null) {
        hello.on('auth.login', function(auth) {
          // Call user information, for the given network
          hello(auth.network).api('/me').then(function(r) {
            userName = "Hello "+r.email;
            document.getElementById("helloname").innerHTML = userName;
          });
      });
      }
      
      return session && session.access_token && session.expires > currentTime;
    };

    //console.log('win = '+online(win));
    
    return (
      <div className="App">
        {online(goog) || online(win) ? (<div><p id="helloname">
          </p>
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
