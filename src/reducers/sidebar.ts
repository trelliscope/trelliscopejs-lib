import { ACTIVE_SIDEBAR } from '../constants';

const sidebarReducer = (state = { active: '' }, action: { type: string; active: string; }) => {
  switch (action.type) {
    case ACTIVE_SIDEBAR:
      return { ...state, active: action.active === state.active ? '' : action.active };
    default:
  }
  return state;
};

export default sidebarReducer;
