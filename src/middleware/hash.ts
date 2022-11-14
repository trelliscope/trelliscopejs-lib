import type { Middleware } from 'redux';
import type { RootState } from '../store';
import { SB_REV_LOOKUP } from '../constants';
import { sortSlice } from '../slices/sortSlice';
import { labelsSlice } from '../slices/labelsSlice';
import { layoutSlice } from '../slices/layoutSlice';
import { filterSlice } from '../slices/filterSlice';
import { selectedDisplaySlice } from '../slices/selectedDisplaySlice';
import { sidebarSlice } from '../slices/sidebarSlice';

const { setSort } = sortSlice.actions;
const { setLabels } = labelsSlice.actions;
const { setLayout } = layoutSlice.actions;
const { setFilter, setFilterView } = filterSlice.actions;
const { setSelectedDisplay } = selectedDisplaySlice.actions;
const { setActiveSidebar } = sidebarSlice.actions;

// this updates the window hash whenever the state changes
export const hashFromState = (state: RootState) => {
  // display
  const display = state.selectedDisplay;
  // layout
  const { layout } = state;
  const layoutPars = `nrow=${layout.nrow}&ncol=${layout.ncol}&arr=${layout.arrange}&pg=${layout.pageNum}`;
  // labels
  const { labels } = state;
  // sort
  const sort = [...state.sort]; // TODO: should this be a deep copy?
  sort.sort((a: Sort, b: Sort) => (a.order > b.order ? 1 : -1));
  const sortStr = sort.map((d: Sort) => `${d.name};${d.dir}`).join(',');
  // filter
  const { filter } = state;
  const filterStrs = Object.keys(filter.state).map((k) => {
    const flt = filter.state[k];
    let res = '';
    if (flt.type === 'select') {
      const value = flt.value as FilterCat;
      res = `var:${flt.name};type:select;val:${value.map(encodeURIComponent).join('#')}`;
    } else if (flt.type === 'regex') {
      res = `var:${flt.name};type:regex;val:${encodeURIComponent(flt.regex as string)}`;
    } else if (flt.type === 'range') {
      const value = flt.value as FilterRange;
      const from = value.from ? value.from : '';
      const to = value.to ? value.to : '';
      res = `var:${flt.name};type:range;from:${from};to:${to}`;
    }
    return res;
  });

  // sidebar
  const { sidebar } = state;
  const sb = SB_REV_LOOKUP[sidebar.active];

  // filterView
  let fv = '';
  if (filter.view.active) {
    fv = filter.view.active.join(',');
  }

  const hash = `display=${display.name}&${layoutPars}&labels=${labels.join(',')}\
&sort=${sortStr}&filter=${filterStrs.join(',')}&sidebar=${sb}&fv=${fv}`;
  return hash;
};

// Panel Grid Layout
// Hide Labels
// Filter Panels
// Sort Panels

export const hashMiddleware: Middleware<RootState> =
  ({ getState }) =>
  (next) =>
  (action) => {
    if (!getState().app.singlePageApp) return next(action);

    const types = [
      setSelectedDisplay.type,
      setLayout.type,
      setLabels.type,
      setSort.type,
      setFilter.type,
      setActiveSidebar.type,
      setFilterView.type,
    ];
    const result = next(action);
    if (types.indexOf(action.type) > -1) {
      const hash = hashFromState(getState());
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    }
    return result;
  };
