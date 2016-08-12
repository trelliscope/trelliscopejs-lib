import { createSelector } from 'reselect';
// import { displayInfoSelector } from './display';

export const pageNumSelector = state => state.layout.pageNum;
export const nPerPageSelector = state => state.layout.nrow * state.layout.ncol;
export const filterStateSelector = state => state.filter.state;
export const filterViewStateSelector = state => state.filter.view;
export const sortSelector = state => state.sort;
export const layoutSelector = state => state.layout;
export const labelsSelector = state => state.labels;
export const aspectSelector = state =>
  state._displayInfo.info.height / state._displayInfo.info.width;
export const cogDataSelector = state => state._cogDataMutable;

// store.getState()._cogDataMutable.groupRefs.state.all()

export const cogFiltDistSelector = createSelector(
  cogDataSelector, filterStateSelector,
  filterViewStateSelector,
  (cogData, filter, filterView) => {
    const result = {};
    if (cogData.iface && cogData.crossfilter && cogData.iface.type === 'JSON') {
      // for every active filter, calculate the conditional distribution
      const keys = filterView.active;
      for (let i = 0; i < keys.length; i++) {
        let dist = [];
        if (cogData.groupRefs[keys[i]]) {
          dist = cogData.groupRefs[keys[i]].all();
        }
        const orderValue = filter[keys[i]] && filter[keys[i]].orderValue ?
          filter[keys[i]].orderValue : 'ct,desc';
        result[keys[i]] = {
          dist,
          // max: maxVal,
          orderValue,
          activeTot: dist.length
        };
      }
    }
    return result;
  }
);

export const filterCardinalitySelector = createSelector(
  cogDataSelector, filterStateSelector,
  (cd, filt) => (cd.allRef === undefined && filt ? 0 : cd.allRef.value())
);
