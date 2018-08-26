import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Intro from './Intro';
import PropTypes from 'prop-types';

class App extends Component {

constructor(props){
  super(props);
  this.yourname = "ammy";
  this.state = {};
}

sayHello(name){
  return "Hello " + name;
}

  render() {
    const myName = "nestor";
    return (
      <div className="App">
        <div className="App-header">
          <img stc={logo} className="App-logo" alt="logo" />
          <h2> Welcome, this is now component life cycle </h2>
        </div>
          <Body />
      </div>
    );
  }
}

class Body extends Component {
  constructor(props){
    super(props);

    this.state = {
      r: 0
    };
    this.getRandomNumber = this.getRandomNumber.bind(this);
  }

  getRandomNumber(){
    this.setState({ r: Math.floor(Math.random()*10) })
  }

  render(){
    return(
      <div>
        <p className="App-intro">
          Hi there.
        </p>
        <button onClick={this.getRandomNumber}> Random Number </button>
        <Numbers myNumber={this.state.r}/>
      </div>
    );
  }
}

class Numbers extends Component {
  componentWillMount(){
    console.log("willmount call here");
  }

  componentDidMount(){
    console.log("didmount call here");
  }

  componentWillReceiveProps(newProps){
    console.log("receiveProps called");
  }

  render(){
    return(
      <div>
        <br />
        {this.props.myNumber}
      </div>
    );
  }
}

App.propTypes = {
  propObject: PropTypes.object,
  propString: PropTypes.string,
  propNumber: PropTypes.number,
}

App.defaultProps = {
  propNumber: 3,
  propString: "This is prop string",
  propObject: {
    obj1: "I am obj 1",
    obj2: "I am obj 2",
    obj3: "I am obj 3"
  }
}

class Parent extends Component {
  constructor(props){
    super(props);

    this.state = {
      cars: ['sBMW', 'sMERC', 'sCity', 'sAudi']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState( {cars: this.state.cars.reverse()} );
  }

  render(){
    return(
      <div>
        <h2 onClick={this.handleClick}> Just some info </h2>
        <Cars msg="cars are cool" model="123" coolCars={this.state.cars}/>
      </div>
    );
  }
}

Parent.defaultProps = {
  cars: ['BMW', 'MERC', 'City', 'Audi']
}

class Cars extends Component {
  render(){
    console.log(this.props);
    return(
      <div>
        <h3> I am from cars component </h3>
        <p>{this.props.msg}</p>
        <p>{this.props.model}</p>
        <div>{this.props.coolCars.map((item, i) => {
             return  <p key={i}>{item}</p>;
          })}</div>
      </div>
    );
  }
}

export default App;
