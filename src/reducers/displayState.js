import omit from 'lodash.omit';
import { combineReducers } from 'redux';
import {
  SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER, SET_FILTER_VIEW
} from '../constants';

export const layout = (state = {
  nrow: 1, ncol: 1, arrange: 'row', pageNum: 1
}, action) => {
  switch (action.type) {
    case SET_LAYOUT: {
      // if the layout change was to nrow / ncol
      // then we need to recompute pageNum
      const obj = { ...action.layout };
      if (obj.nrow || obj.ncol) {
        const prevPanelIndex = (state.nrow * state.ncol * (state.pageNum - 1)) + 1;
        obj.pageNum = Math.ceil(prevPanelIndex / (obj.nrow * obj.ncol));
        if (Number.isNaN(obj.pageNum)) {
          obj.pageNum = 1;
        }
      }
      return { ...state, ...obj };
    }
    default:
  }
  return state;
};

export const labels = (state = [], action) => {
  switch (action.type) {
    case SET_LABELS:
      return Object.assign([], [], action.labels);
    default:
  }
  return state;
};

export const sort = (state = [], action) => {
  switch (action.type) {
    case SET_SORT: {
      if (typeof action.sort === 'number') {
        const newState = Object.assign([], [], state);
        newState.splice(action.sort, 1);
        return newState;
      }
      if (action.sort === undefined) {
        return [];
      }
      return Object.assign([], [], action.sort);
    }
    default:
  }
  return state;
};

const filterState = (state = {}, action) => {
  switch (action.type) {
    case SET_FILTER: {
      // action.filter should be an object to replace the previous state
      // but if it's a string, the filter with that name will be removed
      if (typeof action.filter === 'string' || action.filter instanceof String) {
        return omit(state, action.filter);
      }
      if (action.filter === undefined) {
        return {};
      }
      if (Object.keys(action.filter).length === 0 && action.filter.constructor === Object) {
        return {};
      }
      return { ...state, ...action.filter };
    }
    default:
  }
  return state;
};

const filterView = (state = { active: [], inactive: [] }, action) => {
  switch (action.type) {
    case SET_FILTER_VIEW: {
      let view = { ...state };
      if (view.active === undefined) {
        view.active = [];
      }
      if (view.inactive === undefined) {
        view.inactive = [];
      }
      if (action.which === 'remove') {
        const idxA = view.active.indexOf(action.name);
        if (idxA > -1) {
          view.active.splice(idxA, 1);
        }
        const idxI = view.inactive.indexOf(action.name);
        if (idxI < 0) {
          view.inactive.push(action.name);
        }
      } else if (action.which === 'add') {
        const idxA = view.inactive.indexOf(action.name);
        if (idxA > -1) {
          view.inactive.splice(idxA, 1);
        }
        const idxI = view.active.indexOf(action.name);
        if (idxI < 0) {
          view.active.push(action.name);
        }
      } else if (action.which === 'set') {
        view = action.name;
      }
      return view;
    }
    default:
  }
  return state;
};

export const filter = combineReducers({
  state: filterState,
  view: filterView
});
