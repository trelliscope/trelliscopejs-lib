import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import difference from 'lodash.difference';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHashFilters } from '../selectors/hash';

export interface FilterState {
  state: IFilterState[];
  view: FilterView;
}

const initialState: FilterState = {
  state: selectHashFilters() || [],
  view: {
    active: [],
    inactive: [],
  },
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterState['state'] | string | undefined>) => {
      if (typeof action.payload === 'string') {
        state.state = state.state.filter((f) => f.varname !== action.payload);
      } else if (action.payload === undefined || Object.keys(action.payload).length === 0) {
        state.state = [];
      } else {
        state.state = [...state.state, ...action.payload];
      }
    },
    setFilterView: (state, action: PayloadAction<{ which?: 'remove' | 'add' | 'set'; name: string | FilterView }>) => {
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
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled, (state, action) => {
      const hashFilter = selectHashFilters();

      if (hashFilter !== undefined) {
        state.state = hashFilter || [];
      } else {
        const { filter } = action.payload.state;
        if (filter === undefined || filter.length === 0) {
          state.state = [];
        } else {
          state.state = [...state.state, ...filter];
        }
      }

      const filterables = action.payload.metas.filter((m) => m.filterable).map((m) => m.varname);
      const active = state.state.map((f) => f.varname);
      state.view.active = active;
      state.view.inactive = difference(filterables, active);
    });
  },
});

export const { setFilter, setFilterView } = filterSlice.actions;

export const selectFilterState = (state: RootState) => state.filter.state;

export default filterSlice.reducer;
