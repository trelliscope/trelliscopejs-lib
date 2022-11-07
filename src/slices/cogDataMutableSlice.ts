import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Crossfilter, Dimension, Group, GroupAll, NaturallyOrderedValue } from 'crossfilter2';

export interface CogDataMutableState {
  isFetching: boolean;
  isLoaded: boolean;
  didInvalidate: boolean;
  lastUpdated?: number;
  crossfilter?: Crossfilter<CogData>;
  dimensionRefs: Dimension<CogData, NaturallyOrderedValue>;
  groupRefs: Group<CogData, NaturallyOrderedValue, number>;
  allRef: GroupAll<CogData, NaturallyOrderedValue> | undefined;
  iface: CogInterface;
}

const initialState: CogDataMutableState = {
  isFetching: false,
  isLoaded: false,
  didInvalidate: false,
  crossfilter: {} as Crossfilter<CogData>,
  dimensionRefs: {} as Dimension<CogData, NaturallyOrderedValue>,
  groupRefs: {} as Group<CogData, NaturallyOrderedValue, number>,
  allRef: {} as GroupAll<CogData, NaturallyOrderedValue> | undefined,
  iface: {} as CogInterface,
};

export const cogDataMutableSlice = createSlice({
  name: 'cogDataMutable',
  initialState,
  reducers: {
    receiveCogData: (state, action: PayloadAction<{ iface: CogInterface, crossfilter?: Crossfilter<CogData> }>) => {
      state.isFetching = false;
      state.isLoaded = false;
      state.didInvalidate = true;
      state.lastUpdated = Date.now();
      state.crossfilter = action.payload.crossfilter;
      state.dimensionRefs = {} as Dimension<CogData, NaturallyOrderedValue>;
      state.groupRefs = {} as Group<CogData, NaturallyOrderedValue, number>;
      state.allRef = action.payload.crossfilter !== undefined ? action.payload.crossfilter.groupAll() : undefined;
      state.iface = action.payload.iface;
    },
  },
});

export const { receiveCogData } = cogDataMutableSlice.actions;

export default cogDataMutableSlice.reducer;
