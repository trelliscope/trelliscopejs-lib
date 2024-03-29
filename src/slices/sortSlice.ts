import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHash, selectHashSorts } from '../selectors/hash';

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
    setReOrderSorts: (state, action: PayloadAction<ISortState[]>) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      // If the hash sort is set, use it instead of the sort from the API
      const hash = selectHash();
      const hashSort = selectHashSorts();

      if (Object.keys(hash).length > 2 && hashSort === undefined) {
        return [];
      }
      if (hashSort !== undefined) {
        return hashSort || [];
      }

      return action.payload.state.sort;
    });
  },
});

export const selectSort = (state: RootState) => state.sort;

export const { setSort, setReOrderSorts } = sortSlice.actions;

export default sortSlice.reducer;
