import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHashLabels } from '../selectors/hash';

const initialState: string[] = selectHashLabels();

export const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setLabels: (state, action: PayloadAction<string[]>) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      // If the hash labels are set, use them instead of the labels from the API
      const hashLabels = selectHashLabels();
      if (hashLabels.length) {
        return hashLabels;
      }

      const { labels } = action.payload.state;
      return labels.varnames;
    });
  },
});

export const { setLabels } = labelsSlice.actions;

export default labelsSlice.reducer;
