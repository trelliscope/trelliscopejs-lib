import { WINDOW_RESIZE, UPDATE_DIMS } from '../constants';

const windowHeight = typeof window === 'object' ? window.innerHeight : null;
const windowWidth = typeof window === 'object' ? window.innerWidth : null;

const uiReducer = (
  state = {
    windowHeight,
    windowWidth,
    origHeight: undefined,
    origWidth: undefined
  }, action) => {
  switch (action.type) {
    case WINDOW_RESIZE:
      return {
        ...state,
        windowHeight: action.dims.height,
        windowWidth: action.dims.width
      };
    case UPDATE_DIMS:
      return {
        ...state,
        origHeight: action.dims.height,
        origWidth: action.dims.width
      };
    default:
  }
  return state;
};

export default uiReducer;
