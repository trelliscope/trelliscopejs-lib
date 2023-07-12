import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHash, selectHashLabels } from '../selectors/hash';

const initialState: string[] = selectHashLabels();

export const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setLabels: (state, action: PayloadAction<string[]>) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      const hash = selectHash();
      const hashLabels = selectHashLabels();
      if (Object.keys(hash).length > 2 && hashLabels.length === 0) {
        return [];
      }
      if (hashLabels.length) {
        return hashLabels;
      }
      const { labels } = action.payload.state;
      return labels.varnames;
    });
  },
});

export const { setLabels } = labelsSlice.actions;
export const selectLabels = (state: RootState) => state.labels;

export default labelsSlice.reducer;
