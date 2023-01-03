import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import difference from 'lodash.difference';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { displayInfoAPI, useDisplayMetas } from './displayInfoAPI';
import { selectHashFilters, selectHashFilterView } from '../selectors/hash';

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
      const hashFilterView = selectHashFilterView();

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

      if (hashFilterView.length > 0) {
        state.view.active = hashFilterView;
        state.view.inactive = difference(filterables, hashFilterView);
      }
    });
  },
});

export const { setFilter, setFilterView } = filterSlice.actions;

export const selectFilterState = (state: RootState) => state.filter.state;

export const selectFilterByVarname = (varname: string) => (state: RootState) =>
  state.filter.state.find((f) => f.varname === varname);

export const selectFilterView = (state: RootState) => state.filter.view;

export const selectInactiveFilterView = (state: RootState) => state.filter.view.inactive;

// TODO: see if we can share code with the other one
export const commonTagsKey = '__common__';
export const useInactiveFilterGroups = () => {
  const metas = useDisplayMetas();
  const inactiveFilters = useSelector(selectInactiveFilterView);

  return metas.reduce<{ [index: string | symbol]: string[] }>(
    (acc, meta) => {
      const tags = meta.tags || [];
      if (tags.length === 0 && inactiveFilters.includes(meta.varname) && meta.filterable) {
        acc[commonTagsKey].push(meta.varname);
        return acc;
      }
      tags.forEach((tag) => {
        if (!acc[tag]) {
          acc[tag] = [];
        }
        if (inactiveFilters.includes(meta.varname) && meta.filterable) {
          acc[tag].push(meta.varname);
        }
      });
      return acc;
    },
    { [commonTagsKey]: [] },
  );
};

export default filterSlice.reducer;
