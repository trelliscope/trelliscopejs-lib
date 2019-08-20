import { REQUEST_COGDATA, RECEIVE_COGDATA } from '../constants';

const _cogDataMutable = (state = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false
}, action) => {
  switch (action.type) {
    case REQUEST_COGDATA:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
        didInvalidate: false
      };
    case RECEIVE_COGDATA:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        crossfilter: action.crossfilter,
        dimensionRefs: {},
        groupRefs: {},
        allRef: action.crossfilter !== undefined
          ? action.crossfilter.groupAll() : undefined,
        iface: action.iface,
        lastUpdated: action.receivedAt
      };
    default:
      return state;
  }
};

export default _cogDataMutable;
