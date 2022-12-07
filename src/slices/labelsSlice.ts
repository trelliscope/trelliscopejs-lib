import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { displayInfoAPI } from './displayInfoAPI';

const initialState: string[] = [];

export const labelsSlice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    setLabels: (state, action: PayloadAction<string[]>) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      const { labels } = action.payload.state;
      return labels.varnames;
    });
  },
});

export const { setLabels } = labelsSlice.actions;

export default labelsSlice.reducer;
