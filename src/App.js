import React,{ Component } from 'react';

let hello = require('hellojs/dist/hello.all.js')

hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
  //'393849222573-3770pnkhh6ta113vrf10j7hr169j42la.apps.googleusercontent.com',
  windows: '64d87118-92ad-4898-85eb-a05dc8af6e49',
  facebook: ''
}, {redirect_uri: 'http://localhost:3000'});

class App extends Component {
  state = {
    isLogin:false,
    update:false,
    currentData:[],
    rendered:false,
    insertMode: false,
    currentUser: "",
    currentProvider: "",
    currentCount: 0
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

  loginFacebook = () => {
    hello('facebook').login({
      scope: 'email',
      force: true
  });
  }

  logoutApp = () => {
    var c = this.state.currentCount+1;
    this.updateCount(this.state.currentUser,this.state.currentProvider,c);
    
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
          response.json().then((resp) => {
            resolve(resp.countValue);
          });
        })
        .then((returnedData) => {
        })
        .catch((err) => {
            console.log(err.message);
            reject(0);
        });
    })
  }

  handleCount(email,provider) {
    this.getCount(email,provider).then(count => {
      var userName = "You have logged into user "+email+", provider "
      +provider+" "+count+" times.";
      this.setState({currentCount: count});
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
      return response.json();
    })
    .then((returnedData) => {}).catch((err) => {
      return err.message;
  });
  }

  updateCount(user,provider,count) {
    var url = 'http://localhost:3001/update/';
    url += '?param1='+user+'&param2='+provider+'&param3='+count;
    return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((returnedData) => {
      this.setState({insertMode: false});
    }).catch((err) => {
      this.setState({insertMode: true});
      return err.message;
  });
  }

    isOnline(session) {
      var self = this;
      var currentTime = (new Date()).getTime() / 1000;

      if(!this.state.rendered) {
        //return;
      }
      if(session != null) {
        hello.on('auth.login', function(auth) {
          // Call user information, for the given network
          hello(auth.network).api('/me').then(function(r) {
            const user = r.email;
            const provider = auth.network;
            if(r.email === "") {
              return;            
            }
            self.setState({currentUser: user,currentProvider: provider});

            self.getCount(r.email,auth.network).then(count => {
              if(self.state.insertMode) {
                return;
              }
              self.setState({currentCount: count});
              

              if(count === undefined || count === 0) {
                self.setState({insertMode: true});
                
                self.insertRow(user,provider).then(function(){
                  var self2 = self;
                  self2.handleCount(user,provider);
                });
              }
               else {
                self.handleCount(user,provider);
              }
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
    
    return (
      <div className="App">
        {onlineGoogle || onlineWin ? (<div>
          <p id="helloname"></p>
          <button onClick={()=>this.logoutApp()}>Logout</button>
          </div>) : 
        (<div>
          <button onClick={()=>this.loginGoogle()}>Google Login</button>
        <button onClick={()=>this.loginWindows()}>WindowsLogin</button>
        </div>)}
      </div>
    )
  }
}

export default App;
