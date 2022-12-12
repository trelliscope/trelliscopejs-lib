import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { displayInfoAPI } from './displayInfoAPI';

const initialState: ISortState[] = [];

export const sortSlice = createSlice({
  name: 'sort',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<ISortState[] | number>) => {
      if (typeof action.payload === 'number') {
        return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
      }

      if (action.payload === undefined) {
        return [];
      }

      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => action.payload.state.sort);
  },
});

export const selectSort = (state: RootState) => state.sort;

export const { setSort } = sortSlice.actions;

export default sortSlice.reducer;
