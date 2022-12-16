import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface DisplayListState {
  isFetching: boolean;
  isLoaded: boolean;
  didInvalidate: boolean;
  list: Display[];
  lastUpdated?: number;
}

const initialState: DisplayListState = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  list: [],
  lastUpdated: 0,
};

export const displayListSlice = createSlice({
  name: 'displayList',
  initialState,
  reducers: {
    requestDisplayList: (state) => {
      state.isFetching = true;
      state.isLoaded = false;
      state.didInvalidate = false;
    },
    receiveDisplayList: (state, action: PayloadAction<Display[]>) => {
      state.isFetching = false;
      state.didInvalidate = false;
      state.isLoaded = true;
      state.list = action.payload;
      state.lastUpdated = Date.now();
    },
  },
});

export const { requestDisplayList, receiveDisplayList } = displayListSlice.actions;

export default displayListSlice.reducer;
