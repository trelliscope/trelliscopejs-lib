import { SET_PANEL_RENDERER } from '../constants';

const panelRendererReducer = (state = {
  fn: null
}, action) => {
  switch (action.type) {
    case SET_PANEL_RENDERER:
      return { ...state, fn: action.fn };
    default:
  }
  return state;
};

export default panelRendererReducer;
