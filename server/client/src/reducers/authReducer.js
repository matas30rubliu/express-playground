import { FETCH_USER } from '../actions/types';

// By default app does not know if user is logged in, hence init value for state = null
export default function(state = null, action) {
  switch (action.type) {
// watch for FETCH_USER action. This will return boolean, which will be used to decide what to show in the Header component
    case FETCH_USER:
    // payload is user model from ../actions/index
    // when payload is "", make sure to return false. This is JS trick :) because !"" = true and !!"" = false.
      return action.payload || false;
    default:
      return state;
  }
}
