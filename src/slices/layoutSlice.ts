import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHashLayout } from '../selectors/hash';
import { addFilter, removeFilter, updateFilter, updateFilterValues } from './filterSlice';

const fallbackState: ILayoutState = {
  nrow: 1,
  ncol: 1,
  arrange: 'rows',
  page: 1,
  type: 'layout',
};

const initialState = selectHashLayout() as ILayoutState;

export interface LayoutAction {
  nrow?: number;
  ncol?: number;
  arrange?: 'rows' | 'cols';
  page?: number;
  type?: 'layout';
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<LayoutAction>) => {
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
export const selectNumPerPage = (state: RootState) =>
  state.layout.nrow && state.layout.ncol ? state?.layout.nrow * state.layout.ncol : 0;
export const selectPage = (state: RootState) => state.layout.page;

export default layoutSlice.reducer;
