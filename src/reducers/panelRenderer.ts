import { SET_PANEL_RENDERER } from '../constants';

const panelRenderersReducer = (
  state = {} as PanelRenderers,
  action: {
    type: string;
    name: string;
    fn: (x: number | string, width: number, height: number) => void;
  },
) => {
  switch (action.type) {
    case SET_PANEL_RENDERER:
      return {
        ...state,
        [action.name]: {
          fn: action.fn,
        },
      };
    default:
  }
  return state;
};

export default panelRenderersReducer;
