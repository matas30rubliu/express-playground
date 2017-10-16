import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// BrowserRouter figures out which components should be displayed at specific route
// Route is used to setup rules between router and components

import carBackground from './carBackground.jpg';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { Parallax } from 'react-materialize'
import Header from './Header';
import PassengerLookup from './PassengerLookup';

// 'fake'components to show how routes work
const Home = () => <h2>User home page</h2>;
const PublicHome = () => <h2>Welcome to the page</h2>;

class App extends Component {
  // react components lifecycle methods: componentWillMount, componentWillUpdate, componentWillUnmount....
  // componentWillMount() is invoked immediately before mounting occurs. It is called before render()

  // componentDidMount() is invoked immediately after a component is mounted.
  // Initialization that requires DOM nodes should go here.
  // If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
  // Setting state in this method will trigger a re-rendering.
  componentDidMount() {
    // ajax action creater call
    this.props.fetchUser();
  }

  render() {
    return (
      <div>
        <div className="parallax-container">

          <BrowserRouter>
            <div>
              <Header />
              <Route exact path="/" component={PassengerLookup} />
              <Route path="/userHome" component={Home} />
              <Route path="/public" component={PublicHome} />
            </div>
          </BrowserRouter>

          <div className="parallax">
              <Parallax className="carImg" imageSrc={carBackground}/>
          </div>
        </div>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
        <p>Parallax test</p>
      </div>
    );
  }
};

// connect App component to redux store by using react-redux helper
// first connect param is mapStateToProps, second mapDispatchToProps - action creaters we want to wire up
// These params get asigned to props, so we can use them in lifecycle methods
export default connect(null, actions)(App);
