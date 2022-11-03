import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface LayoutState {
  nrow: number;
  ncol: number;
  arrange: 'row' | 'col';
  pageNum: number;
};

const initialState: LayoutState = {
  nrow: 1,
  ncol: 1,
  arrange: 'row',
  pageNum: 1,
};

interface LayoutAction {
  nrow?: number;
  ncol?: number;
  arrange?: 'row' | 'col';
  pageNum?: number;
}

export const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<LayoutAction>) => {
      // if the layout change was to nrow / ncol
      // then we need to recompute pageNum
      const obj = { ...action.payload };
      if (obj.nrow && obj.ncol) {
        const prevPanelIndex = state.nrow * state.ncol * (state.pageNum - 1) + 1;
        obj.pageNum = Math.ceil(prevPanelIndex / (obj.nrow * obj.ncol));
        if (Number.isNaN(obj.pageNum)) {
          obj.pageNum = 1;
        }
      }
      return { ...state, ...obj };
    }
  },
});

export const { setLayout } = layoutSlice.actions;

export default layoutSlice.reducer;