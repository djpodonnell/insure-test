import React,{ Component } from 'react';
import { interval } from 'rxjs';

//window = global.window;
//console.log("win = "+window);
if(typeof window !== 'undefined') {
  window = global.window;
  console.log("undefined = "+global.window);
}

let hello = require('hellojs/dist/hello.all.js');
hello.init({
  google: '343118601751-98jpuellh8ckif2hpi0ak309jb6nufc5.apps.googleusercontent.com',
  windows: '64d87118-92ad-4898-85eb-a05dc8af6e49',
  facebook: ''
}, {redirect_uri: 'http://localhost:3000'});
//console.log("glo = "+global.window);

const authService = require('./authService');

class App extends Component {
  state = {
    isLogin:false,
    update:false,
    currentData:[],
    rendered:false,
    currentUser: "",
    currentProvider: "",
    currentCount: 0
  }

  logoutApp = () => {
    var c = this.state.currentCount+1;
    authService.updateCount(this.state.currentUser,this.state.currentProvider,c);
    
    hello('google').logout();
    hello('windows').logout();
    this.setState({isLogin:false});
  }

  componentDidMount() {
    var updated = this.state.update;
    this.setState({rendered:true});
    //this.interval= setInterval(() => this.setState({ update: !updated }), 1000);
  }
  componentWillUnmount() {
    //clearInterval(this.interval);
  }

  handleCount(email:string,provider:string) {

    authService.getCount(email,provider).then((count:any) => {
      var userName = "You have logged into user "+email+", provider "
      +provider+" "+count+" times.";
      this.setState({currentCount: count});
      if(document.getElementById("helloname") !== null) {
          document!.getElementById("helloname")!.innerHTML = userName;
      }
    }).then((error:any) => {
    });
  }

    isOnline(session:any) {
      var self = this;
      var currentTime = (new Date()).getTime() / 1000;

      if(!this.state.rendered) {
        return;
      }
      if(session != null) {
        hello.on('auth.login', function(auth:any) {
          // Call user information, for the given network
          authService.getNetworkResponse(auth.network).then(function(r:any) {
            const user = r.email;
            const provider = auth.network;
            if(r.email === "") {
              return;            
            }
            self.setState({currentUser: user,currentProvider: provider});

            authService.getCount(r.email,auth.network).then((count:any) => {
              self.setState({currentCount: count});

              if(count === undefined || count === 0) {
                authService.insertRow(user,provider).then(function(){
                  var self2 = self;
                  self2.handleCount(user,provider);
                });
              }
               else {
                self.handleCount(user,provider);
              }
            }).catch((err:any) => {
              if(document.getElementById("helloname") !== null) {
                document!.getElementById("helloname")!.innerHTML = 
                err+" Check the status of the server and database.";
            }
            });
          });
      });
      }
      
      return session && session.access_token && session.expires > currentTime;
    };

  render() {
    const goog = authService.getAuthResponse('google');
    const win = authService.getAuthResponse('windows');
    const onlineGoogle = this.isOnline(goog);
    const onlineWin = this.isOnline(win);
    
    return (
      <div className="App">
        {onlineGoogle || onlineWin ? (<div>
          <p id="helloname"></p>
          <button id="logoutButton" onClick={()=>this.logoutApp()}>Logout</button>
          </div>) : 
        (<div>
          <button id="googleButton" onClick={()=>authService.helloGoogle()}>Google Login</button>
        <button onClick={()=>authService.helloWindows()}>WindowsLogin</button>
        </div>)}
      </div>
    )
  }
}

export default App;
