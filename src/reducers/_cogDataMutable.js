import { REQUEST_COGDATA, RECEIVE_COGDATA } from '../constants.js';

const _cogDataMutable = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  info: []
}, action) => {
  switch (action.type) {
    case REQUEST_COGDATA:
      return Object.assign({}, state, {
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      });
    case RECEIVE_COGDATA:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        crossfilter: action.crossfilter,
        dimensionRefs: {},
        iface: action.iface,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
};

export default _cogDataMutable;
