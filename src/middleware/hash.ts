import type { Middleware } from 'redux';
import type { RootState } from '../store';
import { SB_REV_LOOKUP } from '../constants';
import { sortSlice } from '../slices/sortSlice';
import { labelsSlice } from '../slices/labelsSlice';
import { layoutSlice } from '../slices/layoutSlice';
import { addFilter, filterSlice, removeFilter, updateFilter, updateFilterValues } from '../slices/filterSlice';
import { selectedDisplaySlice } from '../slices/selectedDisplaySlice';
import { sidebarSlice } from '../slices/sidebarSlice';
import { displayListAPI } from '../slices/displayListAPI';
import { displayInfoAPI } from '../slices/displayInfoAPI';

// Example hash
// /#display=life_expectancy&nrow=5&ncol=3&arr=rows&pg=2&labels=country,year&sort=country;asc,year;desc&filter=var:country;type:select;val:United%20States#Australia#Canada#China#France#Germany#India#Japan#Mexico#Russia#United%20Kingdom#United%20States,var:year;type:range;from:2000;to:2010,var:life_expectancy;type:regex;val:80,var:life_expectancy;type:range;from:80;to:90&sidebar=filter&fv=country,year

const { setSort } = sortSlice.actions;
const { setLabels } = labelsSlice.actions;
const { setLayout } = layoutSlice.actions;
const { setFilterView } = filterSlice.actions;
const { setSelectedDisplay } = selectedDisplaySlice.actions;
const { setActiveSidebar } = sidebarSlice.actions;

// this updates the window hash whenever the state changes
export const hashFromState = (state: RootState) => {
  const hashURL = new URLSearchParams();

  // layout
  const { layout } = state;

  if (layout.ncol) {
    hashURL.append('ncol', layout.ncol.toString());
  }
  if (layout.arrange) {
    hashURL.append('arr', layout.arrange);
  }
  if (layout.page) {
    hashURL.append('pg', layout.page.toString());
  }

  // labels
  const { labels } = state;
  if (labels.length) {
    hashURL.append('labels', labels.join(','));
  }

  // sort
  if (state.sort.length) {
    const sortStr = state.sort.map((d: ISortState) => `${d.varname};${d.dir}`).join(',');
    hashURL.append('sort', sortStr);
  }
  // filter
  const { filter } = state;
  if (filter.state.length) {
    const filterStrs = filter.state.map((flt) => {
      let res = '';
      if (flt.filtertype === 'category') {
        const { values, regexp } = flt as ICategoryFilterState;
        res = `var:${flt.varname};type:category;regexp:${encodeURIComponent((regexp as string) ?? '')};val:${values
          .map(encodeURIComponent)
          .join('#')}`;
      } else if (['numberrange', 'daterange', 'datetimerange'].includes(flt.filtertype)) {
        const { min, max } = flt as INumberRangeFilterState | IDateRangeFilterState | IDatetimeRangeFilterState;
        res = `var:${flt.varname};type:numberrange;min:${min || ''};max:${max || ''}`;
      }
      return res;
    });
    hashURL.append('filter', filterStrs.join(','));
  }

  // sidebar
  const { sidebar } = state;
  if (sidebar) {
    hashURL.append('sidebar', SB_REV_LOOKUP[sidebar.active].toString());
  }

  // filterView
  let fv = '';
  if (filter.view) {
    if (filter.view.active) {
      fv = filter.view.active.join(',');
    }
    hashURL.append('fv', fv);
  }

  /* const hash = `display=${display}&${layoutPars}&labels=${labels.join(',')}\
&sort=${sortStr}&filter=${filterStrs.join(',')}&sidebar=${sb}&fv=${fv}`; */
  return decodeURIComponent(hashURL.toString());
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
      addFilter.type,
      updateFilter.type,
      removeFilter.type,
      updateFilterValues.type,
      setActiveSidebar.type,
      setFilterView.type,
    ];

    const apiActions = [
      displayListAPI.endpoints.getDisplayList.matchFulfilled(action),
      displayInfoAPI.endpoints.getDisplayInfo.matchFulfilled(action),
    ];
    const result = next(action);

    if (types.indexOf(action.type) > -1 || apiActions.some((d) => d)) {
      const hash = hashFromState(getState());
      if (window.location.hash !== hash) {
        window.location.hash = hash;
      }
    }
    return result;
  };
