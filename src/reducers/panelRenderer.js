import { SET_PANEL_RENDERER } from '../constants';

const panelRenderersReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_PANEL_RENDERER:
      return {
        ...state,
        [action.name]: {
          fn: action.fn
        }
      };
    default:
  }
  return state;
};

export default panelRenderersReducer;
