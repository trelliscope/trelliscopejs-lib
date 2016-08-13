
// even though it isn't a good thing to do in redux, we want
// crossfilter to remain mutable so we will use a custom
// middleware to mutate the crossfilter dimensions whenever
// SET_SORT or SET_FILTER operations are performed

const getNumVal = (d, name) => (isNaN(d[name]) ? null : d[name]);
const getCatVal = (d, name) => d[name]; // TODO: what about NaN?

const crossfilterMiddleware = store => next => action => {
  if (action.type === 'SET_FILTER') {
    const cf = store.getState()._cogDataMutable.crossfilter;
    const dimensions = store.getState()._cogDataMutable.dimensionRefs;
    const groups = store.getState()._cogDataMutable.groupRefs;

    if (typeof action.filter === 'string' || action.filter instanceof String) {
      dimensions[action.filter].filter(null); // .remove(), .filterAll() ?
    } else {
      const names = Object.keys(action.filter);
      for (let i = 0; i < names.length; i++) {
        // numeric is always 'range' type
        if (action.filter[names[i]].varType === 'numeric') {
          if (dimensions[names[i]] === undefined) {
            dimensions[names[i]] = cf.dimension(d => getNumVal(d, names[i]));
          }
          if (action.filter[names[i]].value === undefined) {
            dimensions[names[i]].filter(null); // .filterAll()
          } else {
            let fromVal = action.filter[names[i]].value.from;
            let toVal = action.filter[names[i]].value.to;
            fromVal = fromVal === undefined ? -Infinity : fromVal;
            toVal = toVal === undefined ? Infinity : toVal;
            dimensions[names[i]].filter([fromVal, toVal]);
          }
        } else if (action.filter[names[i]].varType === 'factor') {
          if (dimensions[names[i]] === undefined) {
            dimensions[names[i]] = cf.dimension(d => getCatVal(d, names[i]));
          }
          if (groups[names[i]] === undefined) {
            // group.dispose(); // to get rid of previous group
            groups[names[i]] = dimensions[names[i]].group();
          }
          if (action.filter[names[i]].value === undefined) {
            dimensions[names[i]].filter(null); // .filterAll()
          } else if (action.filter[names[i]].type === 'select') {
            // handle select
            const selectVals = action.filter[names[i]].value;
            dimensions[names[i]].filter(d => selectVals.indexOf(d) > -1);
          } else {
            // handle regex
          }
        }
      }
    }

    // const size = store.getState()._cogDataMutable.allRef.value();
    // console.log(`Filtered... size is now ${size}`);
  } else if (action.type === 'SET_FILTER_VIEW') {
    // need to make sure any filter in view has a dimension and group
    // so we can create bar charts / histograms
    // also if the filter is hidden and inactive, we should remove the dimension
    // .remove() ?
    if (action.which === 'add') {
      const cf = store.getState()._cogDataMutable.crossfilter;
      const dimensions = store.getState()._cogDataMutable.dimensionRefs;
      const groups = store.getState()._cogDataMutable.groupRefs;

      const type = store.getState()._displayInfo.info.cogInfo[action.name].type;

      if (dimensions[action.name] === undefined) {
        if (type === 'numeric') {
          dimensions[action.name] = cf.dimension(d => getNumVal(d, action.name));
        } else {
          dimensions[action.name] = cf.dimension(d => getCatVal(d, action.name));
        }
      }

      if (groups[action.name] === undefined) {
        groups[action.name] = dimensions[action.name].group();
      }
    }
  } else if (action.type === 'SET_SORT') {
    // if only sorting on one variable, make a sort dimension according to that variable
    // if more than one variable, crossfilter can only handle sorting on one dimension
    // so we have to get sort index of entire data set and create a new dimension
    // that uses this information
    // this isn't efficient but sorting is expected to happen at much lower frequency
    // than filtering and the user can tolerate more latency with sorting than filtering

    // const cf = store.getState()._cogDataMutable.crossfilter;
    const dimensions = store.getState()._cogDataMutable.dimensionRefs;
    if (dimensions.__sort !== undefined) {
      dimensions.__sort.remove();
    }
  }
  return next(action);
};

export default crossfilterMiddleware;
