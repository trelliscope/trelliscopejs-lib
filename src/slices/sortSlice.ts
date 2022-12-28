import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHashSorts } from '../selectors/hash';

const initialState: ISortState[] = selectHashSorts() || [];

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
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      // If the hash sort is set, use it instead of the sort from the API
      const hashSort = selectHashSorts();
      if (hashSort !== undefined) {
        return hashSort || [];
      }

      return action.payload.state.sort;
    });
  },
});

export const selectSort = (state: RootState) => state.sort;

export const { setSort } = sortSlice.actions;

export default sortSlice.reducer;
