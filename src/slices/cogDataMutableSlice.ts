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
    setDimensionSort: (state, action: PayloadAction<Dimension<CogData, NaturallyOrderedValue>>) => {
      state.dimensionRefs = { __sort: action.payload };
    },
    setDimension: (state, action: PayloadAction<{ key: string; dimension: Dimension<CogData, NaturallyOrderedValue> }>) => {
      if (!state.dimensionRefs) {
        state.dimensionRefs = {} as
          | { __sort: Dimension<CogData, NaturallyOrderedValue> }
          | { [key: string]: Dimension<CogData, NaturallyOrderedValue> };
      }
      state.dimensionRefs[action.payload.key] = action.payload.dimension;
    },
    setGroup: (state, action: PayloadAction<{ key: string; group: Group<CogData, string, number> }>) => {
      if (!state.groupRefs) {
        state.groupRefs = {} as { [key: string]: Group<CogData, string, number> };
      }
      state.groupRefs[action.payload.key] = action.payload.group;
    },
  },
});

export const { receiveCogData, setDimensionSort, setDimension, setGroup } = cogDataMutableSlice.actions;

export default cogDataMutableSlice.reducer;
