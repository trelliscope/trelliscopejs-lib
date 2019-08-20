import { REQUEST_CONFIG, RECEIVE_CONFIG } from '../constants';

const _configReducer = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  config: {}
}, action) => {
  switch (action.type) {
    case REQUEST_CONFIG:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      };
    case RECEIVE_CONFIG:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        config: action.config,
        lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
};

export default _configReducer;
