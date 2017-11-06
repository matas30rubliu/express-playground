import axios from 'axios';
import { FETCH_USER } from './types';

// Action creaters initiate change for redux (change state of redux store which in turn updates react components)
export const fetchUser = () => {
  // Without redux-thunk we would create action and return it like: return { type: FETCH_USER, payload: request }
  // redux-thunk middleware inspects return value of this action creater, if it is a function, redux will call it with dispatch function (it forwards state to reducers)
  return async function(dispatch) {
    // Dispatch action after we got the response
    const currentUser = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: currentUser.data });
    // Using async/await syntax (different syntax for promises)
  };

};

export const submitRoute = values => {
  return async function(dispatch) {
    const persistedRoute = await axios.post('/api/addRoute', values);
    dispatch({ type: FETCH_USER, payload: persistedRoute.data });
  }
}
