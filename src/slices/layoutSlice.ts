import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';

export interface LayoutState {
  nrow: number;
  ncol: number;
  arrange: 'rows' | 'cols';
  page: number;
}

const initialState: LayoutState = {
  nrow: 1,
  ncol: 1,
  arrange: 'rows',
  page: 1,
};

interface LayoutAction {
  nrow?: number;
  ncol?: number;
  arrange?: 'rows' | 'cols';
  page?: number;
}

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<LayoutAction>) => {
      // if the layout change was to nrow / ncol
      // then we need to recompute page
      const obj = { ...action.payload };
      if (obj.nrow && obj.ncol) {
        const prevPanelIndex = state.nrow * state.ncol * (state.page - 1) + 1;
        obj.page = Math.ceil(prevPanelIndex / (obj.nrow * obj.ncol));
        if (Number.isNaN(obj.page)) {
          obj.page = 1;
        }
      }
      return { ...state, ...obj };
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      const { layout } = action.payload.state;
      return { ...state, ...layout };
    });
  },
});

export const { setLayout } = layoutSlice.actions;

export const selectLayout = (state: RootState) => state.layout;
export const selectNumPerPage = (state: RootState) => state.layout.nrow * state.layout.ncol;

export default layoutSlice.reducer;
