import { WINDOW_RESIZE } from '../constants';

const windowHeight = typeof window === 'object' ? window.innerHeight : null;
const windowWidth = typeof window === 'object' ? window.innerWidth : null;

const uiReducer = (state = { windowHeight, windowWidth }, action) => {
  switch (action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, {
        windowHeight: action.dims.height,
        windowWidth: action.dims.width
      });
    default:
  }
  return state;
};

export default uiReducer;
