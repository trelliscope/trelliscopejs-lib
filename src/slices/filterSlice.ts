import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import omit from 'lodash.omit';

export interface FilterState {
  state: {
    [key: string]: Filter<FilterCat | FilterRange>;
  },
  view: FilterView;
}

const initialState: FilterState = {
  state: {},
  view: {
    active: [],
    inactive: [],
  }
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterState['state'] | string | undefined>) => {
      if (typeof action.payload === 'string') {
        state.state = omit(state.state, action.payload);
      } else if (action.payload === undefined) {
        state.state = {};
      } else if (Object.keys(action.payload).length === 0) {
        state.state = {};
      } else {
        state.state = { ...state.state, ...action.payload };
      }
    },
    setFilterView: (state, action: PayloadAction<{ which?: 'remove' | 'add' | 'set', name: string | FilterView}>) => {
      const { view } = state;
      const { which, name } = action.payload;
      if (which === 'remove') {
        const idxA = view.active.indexOf(name as string);
        if (idxA > -1) {
          view.active.splice(idxA, 1);
        }
        const idxI = view.inactive.indexOf(name as string);
        if (idxI < 0) {
          view.inactive.push(name as string);
        }
      } else if (which === 'add') {
        const idxA = view.inactive.indexOf(name as string);
        if (idxA > -1) {
          view.inactive.splice(idxA, 1);
        }
        const idxI = view.active.indexOf(name as string);
        if (idxI < 0) {
          view.active.push(name as string);
        }
      } else if (which === 'set') {
        state.view = name as FilterView;
      }
    }
  },
});

export const { setFilter, setFilterView } = filterSlice.actions;

export default filterSlice.reducer;
