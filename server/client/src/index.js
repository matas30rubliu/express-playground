// import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import gmaps from './public/gmaps.js';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
// by default redux action creaters require to return action
// reduxThunk helps to skip this requirement, its goal is to send actions to store
// reduxThunk passes actions to dispatch function (which belongs to redux store), which send created action to different reducers in the store to update app
// dispatch function works by default too, but reduxThunk enables access to it to manualy dispatch actions whenever we want
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

// use helper createStore to create redux store instance
// createStore takes reducers (each reducer controls specific piece of state) as first param, initial state as second, middleware as third
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));
// redux-thunk is wired as middleware. It inspects what is returned by our action creaters

ReactDOM.render(
  // Provider is react component, which knows how to read changes from redux store (when state is changed in redux store)
  // When state is changed, Provider will inform all childer components about it (and update them)
  // Provider binds our application with store
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
