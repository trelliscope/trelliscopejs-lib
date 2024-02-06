import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHashLayout } from '../selectors/hash';
import { addFilter, removeFilter, updateFilter, updateFilterValues } from './filterSlice';

const fallbackState: ILayoutState = {
  nrow: 1,
  ncol: 1,
  page: 1,
  type: 'layout',
  viewtype: 'grid',
  panel: '',
  sidebarActive: false,
  showLabels: true,
};

const initialState = selectHashLayout() as ILayoutState;

export interface LayoutAction {
  nrow?: number;
  ncol?: number;
  page?: number;
  type?: 'layout';
  viewtype?: ViewType;
  panel?: string;
  sidebarActive?: boolean;
  showLabels?: boolean;
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<LayoutAction>) => {
      // the view change occurs before we know how many rows there will be,
      // but the view needs to know how many rows there will be to calculate the page number that the index will be on .
      // The resize and compute functions are in the content component.

      // const obj = { ...action.payload };
      // const newState = { ...state, ...obj };
      // if (state.viewtype !== newState.viewtype) {
      //   const prevColCount = state.viewtype === 'table' ? state.ncol : 1;
      //   const colCount = newState.viewtype === 'grid' ? newState.ncol : 1;
      //   console.log('prevNRow::', state.nrow, 'prevColCount::', prevColCount, 'page::', state.page);
      //   const prevPanelIndex = state.nrow * prevColCount * (state.page - 1) + 1;
      //   console.log('prevPanelIndex::', prevPanelIndex);
      //   const itemsPerPage = colCount * newState.nrow;
      //   console.log('itemsPerPage::', itemsPerPage, 'newState.nrow::', newState.nrow, 'colCount::', colCount);
      //   console.log('newPage::::', Math.ceil((prevPanelIndex + 1) / itemsPerPage));
      //   obj.page = Math.ceil((prevPanelIndex + 1) / itemsPerPage);
      //   // if (Number.isNaN(obj.page)) {
      //   //   obj.page = 1;
      //   // }
      // }
      // if the layout change was to nrow / ncol
      // then we need to recompute page
      const obj = { ...action.payload };
      if (obj.nrow || obj.ncol) {
        const prevPanelIndex = state.nrow * state.ncol * (state.page - 1) + 1;
        if (obj.nrow) {
          obj.page = Math.ceil(prevPanelIndex / (obj.nrow * state.ncol));
        }
        if (obj.ncol) {
          obj.page = Math.ceil(prevPanelIndex / (state.nrow * obj.ncol));
        }
        if (Number.isNaN(obj.page)) {
          obj.page = 1;
        }
      }
      // for now, if the user changes view, we go back to page 1
      if (obj.viewtype) {
        obj.page = 1;
      }

      return { ...state, ...obj };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => [removeFilter.type, updateFilterValues.type, updateFilter.type, addFilter.type].includes(action.type),
      (state) => ({ ...state, page: 1, type: 'layout' }),
    );
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      const { layout } = action.payload.state;
      // If the hash layout is set, use it instead of the layout from the API
      const hashLayout = selectHashLayout();

      if (hashLayout) {
        return { ...fallbackState, ...state, ...layout, ...hashLayout };
      }

      return { ...fallbackState, ...state, ...layout };
    });
  },
});

export const { setLayout } = layoutSlice.actions;

export const selectLayout = (state: RootState) => state.layout;
export const selectNumPerPage = (state: RootState) => {
  if (state.layout.viewtype === 'table') {
    return state?.layout.nrow;
  }
  if (state.layout.nrow && state.layout.ncol) {
    return state.layout.nrow * state.layout.ncol;
  }
  return 0;
};
export const selectPage = (state: RootState) => state.layout.page;

export default layoutSlice.reducer;
