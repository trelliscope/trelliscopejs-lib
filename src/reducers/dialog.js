import { SET_DIALOG_OPEN } from '../constants';

const dialogReducer = (state = false, action) => {
  switch (action.type) {
    case SET_DIALOG_OPEN:
      return action.isOpen;
    default:
  }
  return state;
};

export default dialogReducer;
