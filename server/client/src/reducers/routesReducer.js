import { FETCH_ROUTES } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_ROUTES:
      return state.concat(action.payload);
    default:
      return state;
  }
}
