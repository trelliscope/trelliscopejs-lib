import type { Reducer } from 'redux';
import { RECEIVE_COGDATA } from '../constants';

const cogDataMutable: Reducer = (
  state = {
    isFetching: false,
    isLoaded: false,
    didInvalidate: false,
  },
  action,
) => {
  switch (action.type) {
    case RECEIVE_COGDATA:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        isLoaded: true,
        crossfilter: action.crossfilter,
        dimensionRefs: {},
        groupRefs: {},
        allRef: action.crossfilter !== undefined ? action.crossfilter.groupAll() : undefined,
        iface: action.iface,
        lastUpdated: action.receivedAt,
      };
    default:
      return state;
  }
};

export default cogDataMutable;
