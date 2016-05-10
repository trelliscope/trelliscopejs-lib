import { SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER } from '../constants.js';

export const layout = (state = { nrow: 1, ncol: 1, arrange: 'row', pageNum: 1 }, action) => {
  switch (action.type) {
    case SET_LAYOUT: {
      // if the layout change was to nrow / ncol
      // then we need to recompute pageNum
      const obj = Object.assign({}, action.layout, {});
      if (obj.nrow || obj.ncol) {
        const prevPanelIndex = state.nrow * state.ncol * (state.pageNum - 1) + 1;
        obj.pageNum = Math.ceil(prevPanelIndex / (obj.nrow * obj.ncol));
        if (isNaN(obj.pageNum)) {
          obj.pageNum = 1;
        }
      }
      return Object.assign({}, state, obj);
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
    case SET_SORT:
      return Object.assign([], [], action.sort);
    default:
  }
  return state;
};

export const filter = (state = [], action) => {
  switch (action.type) {
    case SET_FILTER:
      return Object.assign([], state, action.filter);
    default:
  }
  return state;
};
