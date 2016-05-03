import { ACTIVE_SIDEBAR } from '../constants.js';

const sidebarReducer = (state = { active: '' }, action) => {
  switch (action.type) {
    case ACTIVE_SIDEBAR:
      return Object.assign({}, state, {
        active: action.active === state.active ? '' : action.active
      });
    default:
  }
  return state;
};

export default sidebarReducer;
