import React,{ Component } from 'react';

let hello = require('hellojs/dist/hello.all.js')

hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
  windows: '136e980d-d4ae-4257-8f2d-7f71f34625f5'
}, {redirect_uri: 'http://localhost:3000'});

class App extends Component {
  state = {
    isLogin:false,
    update:true,
    currentData:[]
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

  insertRow(user,provider) {
    var url = 'http://localhost:3001/insert/';
    url += '?param1='+user+'&param2='+provider;
    fetch(url)
    .then((response) => {
      console.log("insert mess2 = "+JSON.stringify(response));
      response.json();
    })
    .then((returnedData) => {}).catch((err) => {
      console.log(err.message);
  });
  }

  updateCount(user,provider,count) {
    var url = 'http://localhost:3001/update/';
    url += '?param1='+user+'&param2='+provider+'&param3='+count;
    fetch(url)
    .then((response) => response.json())
    .then((returnedData) => {
    }).catch((err) => {
      console.log(err.message);
  });
  }

  getCount(user,provider) {
    var count = 0;
    var url = 'http://localhost:3001/hello/';
        url += '?param1='+user+'&param2='+provider;
        fetch(url)
        .then((response) => response.json())
        .then((returnedData) => {
          if(returnedData.data[0] !== undefined) {
            count = returnedData.data[0].count;
          }
        })
        .catch((err) => {
            console.log(err.message);
        });

        return count;
  }

  render() {
    const goog = hello('google').getAuthResponse();
    const win = hello('windows').getAuthResponse();

    var userName = "";
    var self = this;
    var online = function(session) {
      var currentTime = (new Date()).getTime() / 1000;
      if(session != null) {
        hello.on('auth.login', function(auth) {
          // Call user information, for the given network
          hello(auth.network).api('/me').then(function(r) {
            var url = 'http://localhost:3001/hello/';
            url += '?param1='+r.email+'&param2='+auth.network;
            fetch(url)
            .then((response) => response.json())
            .then((returnedData) => {
              if(returnedData.data[0] !== undefined){ console.log("first count = "+returnedData.data[0].count)} 
              else {console.log("None")}

              if(!returnedData.data[0]) {
                console.log("inserting");
                self.insertRow(r.email,auth.network);
              } else {
                var c = returnedData.data[0].count;
                console.log("adding "+c);
                self.updateCount(r.email,auth.network,c++);
              }
                var count = self.getCount(r.email,auth.network);
                userName = "You have logged into user "+r.email+", provider "
                +auth.network+" "+count+" times.";
                document.getElementById("helloname").innerHTML = userName;
            })
            .catch((err) => {
                console.log(err.message);
            });
          });
      });
      }
      
      return session && session.access_token && session.expires > currentTime;
    };

    //console.log('win = '+online(win));
    
    return (
      <div className="App">
        {online(goog) || online(win) ? (<div>
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
