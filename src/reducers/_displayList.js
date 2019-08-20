import { REQUEST_DISPLAY_LIST, RECEIVE_DISPLAY_LIST } from '../constants';

const _displayListReducer = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  list: []
}, action) => {
  switch (action.type) {
    case REQUEST_DISPLAY_LIST:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      };
    case RECEIVE_DISPLAY_LIST:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        list: action.list,
        lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
};

export default _displayListReducer;
