import { REQUEST_COGIFACE, RECEIVE_COGIFACE } from '../constants.js';

const _cogInterface = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  info: []
}, action) => {
  switch (action.type) {
    case REQUEST_COGIFACE:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_COGIFACE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        info: action.info,
        iface: action.iface,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export default _cogInterface;
