import React, { Component } from 'react';
var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyBPmE52d7a8OKPikCB5AkrvduyiWf0a7Ec",
    authDomain: "login-try-96c93.firebaseapp.com",
    databaseURL: "https://login-try-96c93.firebaseio.com",
    projectId: "login-try-96c93",
    storageBucket: "login-try-96c93.appspot.com",
    messagingSenderId: "10877017466"
  };
  firebase.initializeApp(config);



class Authen extends Component {
  login(event) {
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, password);

    promise.then(user => {
      var user = firebase.auth().currentUser;
      var err = "Welcome " + user.email;
      var lout = document.getElementById('logout');
      lout.classList.remove('hide');
    });

    promise.catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
    });
  }

  signup() {
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    // firebase.auth().signInAnonymously().catch(function(error) {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // ...
    // });
    const promise =  firebase.auth().
      createUserWithEmailAndPassword(email, password);

    promise.then(users => {
      var user = firebase.auth().currentUser;

      var err = "Welcome " + user.email;
        firebase.database().ref('users/'+user.uid).set({
          email: email
        });
      console.log(user);
    });
    promise.catch(function(error) {
      var err = error.message;
      console.log(err);
    });
    this.setState({err: firebase.auth().error});
  }

  logout() {
    firebase.auth().signOut();
    var lout = document.getElementById('logout');
    lout.classList.add('hide');
  }

  constructor(props){
    super(props);

    this.state = {
      err: ''
    };

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
  }

  render(){
    return(
      <div>
        <input id="email" ref="email" type="email"
           placeholder="Enter your email" /><br />
         <input id="pass" ref="password" type="password"
           placeholder="Enter your password" /><br />

         <p>{this.state.err}</p>

         <button onClick={this.login}>Log In</button>
         <button onClick={this.signup}>Sign Up</button>
         <button onClick={this.logout} id="logout" className="hide">
           Log Out
         </button>
      </div>
    );
  }
}

export default Authen;
