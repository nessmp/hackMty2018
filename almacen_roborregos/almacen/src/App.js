import React, { Component } from 'react';
import './App.css';
import Navbar from './components/navbar'
import PersistentDrawer from './components/persistent_drawer'

class App extends Component {
  render() {
    return (
      <div>
        <PersistentDrawer />
      </div>
    );
  }
}

export default App;
