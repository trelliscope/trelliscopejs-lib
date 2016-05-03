import { REQUEST_DISPLAY, RECEIVE_DISPLAY } from '../constants.js';

const _displayInfoReducer = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  info: []
}, action) => {
  switch (action.type) {
    case REQUEST_DISPLAY:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_DISPLAY:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        info: action.info,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export default _displayInfoReducer;
