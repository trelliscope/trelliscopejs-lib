import type { Reducer } from 'redux';
import { ACTIVE_SIDEBAR } from '../constants';

const sidebarReducer: Reducer = (state = { active: '' }, action) => {
  switch (action.type) {
    case ACTIVE_SIDEBAR:
      return { ...state, active: action.active === state.active ? '' : action.active };
    default:
  }
  return state;
};

export default sidebarReducer;
