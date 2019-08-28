import { SELECT_DISPLAY, SET_SELECTED_RELDISPS, SET_REL_DISP_POSITIONS } from '../constants';

export const selectedDisplay = (state = {
  name: '',
  group: '',
  desc: ''
}, action) => {
  switch (action.type) {
    case SELECT_DISPLAY:
      return {
        ...state,
        name: action.name,
        group: action.group,
        desc: action.desc
      };
    default:
  }
  return state;
};

export const relDispPositions = (state = [], action) => {
  switch (action.type) {
    case SET_REL_DISP_POSITIONS:
      return Object.assign([], [], action.obj);
    default:
  }
  return state;
};

export const selectedRelDisps = (state = [], action) => {
  switch (action.type) {
    case SET_SELECTED_RELDISPS: {
      const newState = Object.assign([], state);
      if (action.which === 'add') {
        if (newState.indexOf(action.val) < 0) {
          newState.push(action.val);
        }
      } else if (action.which === 'remove') {
        const idx = newState.indexOf(action.val);
        if (idx > -1) {
          newState.splice(idx, 1);
        }
      } else if (action.which === 'reset') {
        return [];
      } else if (action.which === 'set') {
        return action.val;
      }
      newState.sort();
      return newState;
    }
    default:
  }
  return state;
};
