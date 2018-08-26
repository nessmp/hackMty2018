import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar'
import ResponsiveSidebar from './components/sidebar'
import Card from './components/card'
import Footer from './components/footer'

class App extends Component {
  render() {
    return (
      <div>

        <ResponsiveSidebar />
        <div className="container">

          <div className="row">


            <div className="col-lg-9">

              <div className="row">

                <Card />

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }
}

export default App;
