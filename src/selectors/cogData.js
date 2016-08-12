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
        const orderValue = filter[keys[i]] && filter[keys[i]].orderValue ?
          filter[keys[i]].orderValue : 'ct,desc';

        let dist = [];
        // if sort order is count, use .top to get sorted
        // if it is by id (label), use .all to get that order
        if (cogData.groupRefs[keys[i]]) {
          if (orderValue.substr(0, 2) === 'ct') {
            // cogData.groupRefs[keys[i]].order(d => -d);
            dist = cogData.groupRefs[keys[i]].top(Infinity);
          } else {
            dist = cogData.groupRefs[keys[i]].all();
          }
        }

        // crossfilter groups return descending by count
        // but ascending by label
        // so we need to let the barchart know whether to invert
        // we could use Array.reverse but that could be slow
        const reverseRows = ['ct,asc', 'id,desc'].indexOf(orderValue) < 0;

        let maxVal = 0;
        for (let j = 0; j < dist.length; j++) {
          if (dist[j].value > maxVal) {
            maxVal = dist[j].value;
          }
        }

        result[keys[i]] = {
          dist,
          max: maxVal,
          orderValue,
          reverseRows,
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
