import { SET_APP_ID, SET_DIALOG_OPEN, SET_SINGLE_PAGE_APP,
  SET_FULLSCREEN } from '../constants';

export const appId = (state = 'app', action) => {
  switch (action.type) {
    case SET_APP_ID:
      return action.id;
    default:
  }
  return state;
};

export const appDims = (state = { width: 500, height: 500 }, action) => {
  switch (action.type) {
    case SET_APP_ID:
      return action.dims;
    default:
  }
  return state;
};

export const dialog = (state = false, action) => {
  switch (action.type) {
    case SET_DIALOG_OPEN:
      return action.isOpen;
    default:
  }
  return state;
};

export const singlePageApp = (state = true, action) => {
  switch (action.type) {
    case SET_SINGLE_PAGE_APP:
      return action.singlePageApp;
    default:
  }
  return state;
};

export const fullscreen = (state = true, action) => {
  switch (action.type) {
    case SET_FULLSCREEN:
      return action.fullscreen;
    default:
  }
  return state;
};
