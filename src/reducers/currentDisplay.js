import { combineReducers } from 'redux';
import { SELECT_DISPLAY, REQUEST_DISPLAY, RECEIVE_DISPLAY } from '../constants.js';

const selectedDisplay = (state = {
  name: '',
  group: ''
}, action) => {
  switch (action.type) {
    case SELECT_DISPLAY:
      return Object.assign({}, state, {
        name: action.name,
        group: action.group
      });
    default:
  }
  return state;
};

const displayInfo = (state = {
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

const currentDisplayRouter = combineReducers({
  displayInfo,
  selectedDisplay
});

export default currentDisplayRouter;
