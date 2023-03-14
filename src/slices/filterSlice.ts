import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import difference from 'lodash.difference';
import type { RootState } from '../store';
import { displayInfoAPI } from './displayInfoAPI';
import { selectHash, selectHashFilters, selectHashFilterView } from '../selectors/hash';

export interface FilterState {
  state: IFilterState[];
  view: FilterView;
}

const initialState: FilterState = {
  state: selectHashFilters() || [],
  view: {
    active: selectHashFilterView() || [],
    inactive: [],
  },
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    addFilter: (state, action: PayloadAction<IFilterState>) => {
      const { state: filterState } = state;
      const { varname } = action.payload;
      const idx = filterState.findIndex((f) => f.varname === varname);
      if (idx > -1) {
        filterState[idx] = action.payload;
      } else {
        filterState.push(action.payload);
      }
    },
    updateFilter: (state, action: PayloadAction<ICategoryFilterState | INumberRangeFilterState>) => {
      const { state: filterState } = state;
      const { varname } = action.payload;
      const idx = filterState.findIndex((f) => f.varname === varname);
      if (idx > -1) {
        filterState[idx] = action.payload;
      }
    },
    removeFilter: (state, action: PayloadAction<string>) => {
      const { state: filterState } = state;
      const idx = filterState.findIndex((f) => f.varname === action.payload);
      if (idx > -1) {
        filterState.splice(idx, 1);
      }
    },
    updateFilterValues: (state, action: PayloadAction<{ varname: string; value: string }>) => {
      const filterState = state.state;
      const { varname, value } = action.payload;

      const idx = filterState.findIndex((f) => f.varname === varname);
      if (idx > -1) {
        const filter = filterState[idx] as ICategoryFilterState;
        const { values: filterValues } = filter;
        // If filter values are being directly updated than it's not a regexp filter
        filter.regexp = null;
        if (filterValues?.includes(value)) {
          filter.values = difference(filterValues, [value]);
        } else {
          filter.values = [...(filterValues as string[]), value];
        }
      }
    },
    clearFilters: (state) => {
      state.state = [];
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
      const hashFilterView = selectHashFilterView();
      const hash = selectHash();

      if (Object.keys(hash).length > 2 && hashFilter === undefined) {
        return;
      }

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
      state.view.active = active as string[];
      state.view.inactive = difference(filterables, active) as string[];

      if (hashFilterView.length > 0) {
        state.view.active = hashFilterView;
        state.view.inactive = difference(filterables, hashFilterView);
      }
    });
  },
});

export const { setFilterView, addFilter, updateFilterValues, updateFilter, removeFilter, clearFilters } =
  filterSlice.actions;

// Selectors
export const selectFilterState = (state: RootState) => state.filter.state;

export const selectFilterByVarname = (varname: string) => (state: RootState) =>
  (state.filter.state as IFilterState[]).find((f: IFilterState) => (f.varname as string) === varname);

export const selectFilterView = (state: RootState) => state.filter.view;

export const selectInactiveFilterView = (state: RootState) => state.filter.view.inactive;

export const selectActiveFilterView = (state: RootState) => state.filter.view.active;

export default filterSlice.reducer;
