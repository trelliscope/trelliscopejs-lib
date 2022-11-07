import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Crossfilter, Dimension, Group, NaturallyOrderedValue } from 'crossfilter2';

const initialState: CogDataMutable = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
};

export const cogDataMutableSlice = createSlice({
  name: 'cogDataMutable',
  initialState,
  reducers: {
    receiveCogData: (state, action: PayloadAction<{ iface: CogInterface; crossfilter?: Crossfilter<CogData> }>) => {
      state.isFetching = false;
      state.didInvalidate = false;
      state.isLoaded = true;
      state.crossfilter = action.payload.crossfilter;
      state.dimensionRefs = {} as
        | { __sort: Dimension<CogData, NaturallyOrderedValue> }
        | { [key: string]: Dimension<CogData, NaturallyOrderedValue> };
      state.groupRefs = {} as { [key: string]: Group<CogData, string, number> };
      state.allRef = action.payload.crossfilter !== undefined ? action.payload.crossfilter.groupAll() : undefined;
      state.iface = action.payload.iface;
      state.lastUpdated = Date.now();
    },
  },
});

export const { receiveCogData } = cogDataMutableSlice.actions;

export default cogDataMutableSlice.reducer;
