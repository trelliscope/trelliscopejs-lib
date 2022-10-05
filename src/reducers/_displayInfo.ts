import { REQUEST_DISPLAY, RECEIVE_DISPLAY } from '../constants';

const displayInfoReducer = (state = {} as DisplayInfoState, action: { type: string; name: string; info: DisplayObject; receivedAt: number; }) => {
  switch (action.type) {
    case REQUEST_DISPLAY:
      return {
        ...state,
        [action.name]: {
          isFetching: true,
          isLoaded: false,
          info: {},
          didInvalidate: false,
        },
      };
    case RECEIVE_DISPLAY:
      return {
        ...state,
        [action.name]: {
          isFetching: false,
          didInvalidate: false,
          isLoaded: true,
          info: action.info,
          lastUpdated: action.receivedAt,
        },
      };
    default:
      return state;
  }
};

export default displayInfoReducer;
