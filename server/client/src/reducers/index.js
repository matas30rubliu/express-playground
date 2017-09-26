import { combineReducers } from 'redux';
import authReducer from './authReducer.js'

// Redux convention is to use reducers/index.js file to enable importing everything from reducers
// See ../index.js
export default combineReducers({
  // this reducer tells us if user is currently logged in
  auth: authReducer
});
