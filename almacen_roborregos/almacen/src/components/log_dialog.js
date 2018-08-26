import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

var firebase = require('firebase');
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDVzfeFifxT1NSbc3wKVXL_M01eHE7HpX0",
    authDomain: "almacen-roborregos.firebaseapp.com",
    databaseURL: "https://almacen-roborregos.firebaseio.com",
    projectId: "almacen-roborregos",
    storageBucket: "almacen-roborregos.appspot.com",
    messagingSenderId: "644694768812"
  };
  firebase.initializeApp(config);

class LogDialog extends Component {
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleEmailFieldChange(event) {
    this.setState({
        email: event.target.value
    });
  };

  handlePasswordFieldChange(event) {
    this.setState({
        password: event.target.value
    });
  };

  login(event) {
    const email = this.state.email;
    const password = this.state.password;

    firebase.auth().
    signInWithEmailAndPassword(email, password).then(() => {
      this.handleClose();
    }).catch(function(error) {
      // TODO: Display some error to the user
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // TODO: Handle everything fine
    }).catch(function(error) {
      // TODO: handle the error
    });
  }

  constructor(props){
    super(props);

    this.state = {
      err: '',
      email: '',
      password: '',
      open: false,
    };

    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEmailFieldChange = this.handleEmailFieldChange.bind(this);
    this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this);
  }

  render() {
    var styles = {
      paddingRight: "150px",
    };
    return (
      <div className={styles}>
        <Button
          style=
          {this.props.logedin ? {display: 'none'} : {display: 'inline'}}
          color="inherit"
          onClick={this.handleClickOpen}
          id="log_in"
        >
          LogIn
        </Button>
        <Button
          style=
          {this.props.logedin ? {display: 'inline'} : {display: 'none'}}
          className="hide" onClick={this.logout}
          color="inherit" id="log_out"
        >
          LogOut
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">LogIn</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="E-mail"
              type="email"
              fullWidth
              onChange={this.handleEmailFieldChange}
            />
            <TextField
              margin="dense"
              label="Contraseña"
              type="password"
              fullWidth
              onChange={this.handlePasswordFieldChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={this.login} color="primary">
              LogIn
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default LogDialog
