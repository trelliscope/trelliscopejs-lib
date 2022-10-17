import type { Reducer } from 'redux';
import { SELECT_DISPLAY, SET_SELECTED_RELDISPS, SET_REL_DISP_POSITIONS } from '../constants';

export const selectedDisplay: Reducer = (
  state = {
    name: '',
    group: '',
    desc: '',
  },
  action,
) => {
  switch (action.type) {
    case SELECT_DISPLAY:
      return {
        ...state,
        name: action.name,
        group: action.group,
        desc: action.desc,
      };
    default:
  }
  return state;
};

export const relDispPositions = (state = [] as RelDispPositions[], action: { type: string; obj: string }) => {
  switch (action.type) {
    case SET_REL_DISP_POSITIONS:
      console.log('SET_REL_DISP_POSITIONS', action.obj);
      
      return Object.assign([], [], action.obj);
    default:
  }
  return state;
};

export const selectedRelDisps = (state: number[] = [], action: { type: string; which: string; val: number[] }) => {
  switch (action.type) {
    case SET_SELECTED_RELDISPS: {
      const newState = Object.assign([] as number[], state);
      if (action.which === 'reset') {
        return [];
      }
      if (action.which === 'set') {
        return action.val;
      }
      newState.sort();
      return newState;
    }
    default:
  }
  return state;
};
