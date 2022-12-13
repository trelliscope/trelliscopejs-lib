// even though it isn't a good thing to do in redux, we want
// crossfilter to remain mutable so we will use a custom
// middleware to mutate the crossfilter dimensions whenever
// SET_SORT or SET_FILTER operations are performed

import type { Middleware } from 'redux';
import type { RootState } from '../store';
import { sortSlice } from '../slices/sortSlice';
import { filterSlice } from '../slices/filterSlice';
import { setDimensionSort, setDimension, setGroup } from '../slices/cogDataMutableSlice';

const { setSort } = sortSlice.actions;
const { setFilter, setFilterView } = filterSlice.actions;

interface Dimension {
  [key: string]: number;
}
interface SortParam {
  [key: string]: string | number;
}

const MAX_VALUE = 9007199254740992; // we want NAs to always get pushed back in sort
const getNumVal = (d: Dimension, name: string) => (Number.isNaN(d[name] || d[name] === undefined) ? -MAX_VALUE : d[name]);
const getNumValSign = (d: Dimension, name: string, dir: string) => {
  const sign = dir === 'asc' ? 1 : 0;
  return Number.isNaN(d[name]) || d[name] === undefined ? sign * MAX_VALUE : d[name];
};
const getCatVal = (d: Dimension, name: string) => (d[name] ? d[name] : 'NA');

const sortFn = (property: string) => {
  let sortOrder = 1;
  let property2 = property;
  if (property[0] === '!') {
    sortOrder = -1;
    property2 = property2.substr(1);
  }
  return (a: SortParam, b: SortParam) => {
    const result = a[property2] < b[property2] ? -1 : a[property2] > b[property2] ? 1 : 0;
    return result * sortOrder;
  };
};

const multiSort = (args: string[]) => {
  const props = args;
  return (obj1: SortParam, obj2: SortParam) => {
    let i = 0;
    let result = 0;
    while (result === 0 && i < props.length) {
      result = sortFn(props[i])(obj1, obj2);
      i += 1;
    }
    return result;
  };
};

const crossfilterMiddleware: Middleware<RootState> = (store) => (next) => (action) => {
  if (action.type === setFilter.type && action.payload) {
    const cf = store.getState().cogDataMutable.crossfilter;
    const dimensionsState = store.getState().cogDataMutable.dimensionRefs;
    const dimensions = { ...dimensionsState };
    const groupsState = store.getState().cogDataMutable.groupRefs;
    const groups = { ...groupsState };
    if (typeof action.payload === 'string' || action.payload instanceof String) {
      dimensions[action.payload]?.filter(null); // .remove(), .filterAll() ?
    } else {
      const names = Object.keys(action.payload);
      if (names.length === 0 && dimensions) {
        // all filters were reset - remove them all...
        Object.keys(store.getState().filter.state).forEach((nn) => dimensions[nn]?.filter(null));
      }
      for (let i = 0; i < names.length; i += 1) {
        // numeric is always 'range' type
        if (action.payload[names[i]].varType === 'numeric') {
          if (dimensions[names[i]] === undefined) {
            dimensions[names[i]] = cf.dimension((d: Dimension) => getNumVal(d, names[i]));
          }
          if (groups[names[i]] === undefined) {
            // group.dispose(); // to get rid of previous group
            // create group that bins into histogram breaks
            const dispName = store.getState().selectedDisplay.name;
            const ci = store.getState().displayInfo[dispName].info.cogInfo[names[i]];
            groups[names[i]] = dimensions[names[i]].group((d: number) =>
              Number.isNaN(d) || d === undefined ? null : ci.breaks[Math.floor((d - ci.breaks[0]) / ci.delta)],
            );
          }
          if (action.payload[names[i]].value === undefined) {
            dimensions[names[i]].filter(null); // .filterAll()
          } else {
            let fromVal = action.payload[names[i]].value.from;
            let toVal = action.payload[names[i]].value.to;
            fromVal = fromVal === undefined ? -Infinity : fromVal;
            toVal = toVal === undefined ? Infinity : toVal;
            // want to be inclusive on both ends
            dimensions[names[i]].filterFunction((d: number) => d >= fromVal && d <= toVal);
          }
        } else if (action.payload[names[i]].varType === 'factor') {
          if (dimensions[names[i]] === undefined) {
            dimensions[names[i]] = cf.dimension((d: Dimension) => getCatVal(d, names[i]));
          }
          if (groups[names[i]] === undefined) {
            // group.dispose(); // to get rid of previous group
            groups[names[i]] = dimensions[names[i]].group();
          }
          if (action.payload[names[i]].value === undefined) {
            dimensions[names[i]].filter(null); // .filterAll()
          } else {
            // handle select and regex (regex same as select as value is already populated)
            const selectVals = action.payload[names[i]].value;
            dimensions[names[i]].filter((d: number) => selectVals.indexOf(d) > -1);
          }
        }
      }
    }
  } else if (action.type === setFilterView.type) {
    // need to make sure any filter in view has a dimension and group
    // so we can create bar charts / histograms
    // also if the filter is hidden and inactive, we should remove the dimension
    // .remove() ?
    if (action.payload.which === 'add' || action.payload.which === 'set') {
      const cf = store.getState().cogDataMutable.crossfilter;
      const groups = store.getState().cogDataMutable.groupRefs;
      const dispName = store.getState().selectedDisplay.name;
      const dimensions = store.getState().cogDataMutable.dimensionRefs;

      let names = [] as string[];
      if (action.payload.which === 'add') {
        names.push(action.payload.name);
      } else {
        names = action.payload.name.active;
      }

      names.forEach((name: string) => {
        const { type } = store.getState().displayInfo[dispName].info.cogInfo[name];

        if (dimensions[name] === undefined) {
          if (type === 'numeric') {
            next(setDimension({ key: name, dimension: cf.dimension((d: Dimension) => getNumVal(d, name)) }));
          } else {
            next(setDimension({ key: name, dimension: cf.dimension((d: Dimension) => getCatVal(d, name)) }));
          }
        }

        if (groups[name] === undefined) {
          const newDimensions = store.getState().cogDataMutable.dimensionRefs;
          if (type === 'numeric') {
            const ci = store.getState().displayInfo[dispName].info.cogInfo[name];
            next(
              setGroup({
                key: name,
                group: newDimensions[name]?.group((d: number) =>
                  Number.isNaN(d) || d === undefined ? null : ci.breaks[Math.floor((d - ci.breaks[0]) / ci.delta)],
                ),
              }),
            );
          } else {
            next(setGroup({ key: name, group: newDimensions[name]?.group() }));
          }
        }
      });
    }
  } else if (action.type === setSort.type && action.payload !== undefined) {
    // if only sorting on one variable, make a sort dimension according to that variable
    // if more than one variable, crossfilter can only handle sorting on one dimension
    // so we have to get sort index of entire data set and create a new dimension
    // that uses this information
    // this isn't efficient but sorting is expected to happen at much lower frequency
    // than filtering and the user can tolerate more latency with sorting than filtering

    const cf = store.getState().cogDataMutable.crossfilter;
    const dimensions = store.getState().cogDataMutable.dimensionRefs;
    if (dimensions) {
      if (dimensions.__sort) {
        dimensions.__sort.remove();
      }
      let newState = action.payload;
      if (typeof action.payload === 'number') {
        newState = Object.assign([], [], store.getState().sort);
        newState.splice(action.payload, 1);
      }
      if (newState.length === 0) {
        next(setDimensionSort(cf.dimension((d: Dimension) => d.__index)));
      } else if (newState.length === 1) {
        const dispName = store.getState().selectedDisplay.name;
        const ci = store.getState().displayInfo[dispName].info.cogInfo[newState[0].name];
        if (ci.type === 'factor') {
          next(setDimensionSort(cf.dimension((d: Dimension) => getCatVal(d, newState[0].name))));
        } else if (ci.type === 'numeric') {
          next(setDimensionSort(cf.dimension((d: Dimension) => getNumValSign(d, newState[0].name, newState[0].dir))));
        }
      } else {
        const dat = cf.all();
        const sortDat = [];
        for (let i = 0; i < dat.length; i += 1) {
          const elem = { __index: dat[i].__index } as SortParam;
          for (let j = 0; j < newState.length; j += 1) {
            const dispName = store.getState().selectedDisplay.name;
            const ci = store.getState().displayInfo[dispName].info.cogInfo[newState[j].name];
            if (ci.type === 'factor') {
              // TODO: make custom getCatVal that returns first and last ascii value
              // otherwise NA panels can show up in between other panels
              elem[newState[j].name] = getCatVal(dat[i], newState[j].name);
            } else if (ci.type === 'numeric') {
              elem[newState[j].name] = getNumValSign(dat[i], newState[j].name, newState[j].dir);
            }
          }
          sortDat.push(elem);
        }
        const sortSpec = [];
        for (let i = 0; i < newState.length; i += 1) {
          sortSpec.push(`${newState[i].dir === 'asc' ? '' : '!'}${newState[i].name}`);
        }
        sortDat.sort(multiSort(sortSpec));
        const idx = {} as Dimension;
        for (let i = 0; i < sortDat.length; i += 1) {
          idx[sortDat[i].__index] = i;
        }
        next(setDimensionSort(cf.dimension((d: Dimension) => idx[d.__index])));
      }
    }
  }
  return next(action);
};

export default crossfilterMiddleware;
