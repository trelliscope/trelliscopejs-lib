import { SET_LOCAL_PANELS } from '../constants';

const localPanelsReducer = (
  state = {} as DisplayInfoState,
  action: { type: string; dat: [{ key: number; value: number }] },
) => {
  switch (action.type) {
    case SET_LOCAL_PANELS:
      return { ...state, ...action.dat };
    default:
  }
  return state;
};

export default localPanelsReducer;
