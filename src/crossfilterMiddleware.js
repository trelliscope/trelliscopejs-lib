
// even though it isn't a good thing to do in redux, we want
// crossfilter to remain mutable so we will use a custom
// middleware to mutate the crossfilter dimensions whenever
// SET_SORT or SET_FILTER operations are performed

const crossfilterMiddleware = store => next => action => {
  if (action.type === 'SET_FILTER') {
    const cf = store.getState()._cogDataMutable.crossfilter;
    const dimensions = store.getState()._cogDataMutable.dimensionRefs;
    const getVal = (d, name) => (isNaN(d[name]) ? null : d[name]);
    const names = Object.keys(action.filter);
    for (let i = 0; i < names.length; i++) {
      if (action.filter[names[i]].type === 'range') {
        if (dimensions[names[i]] === undefined) {
          // should we destroy dimensions if a variable isn't being filtered anymore?
          dimensions[names[i]] = cf.dimension((d) => getVal(d, names[i]));
        }
        if (action.filter[names[i]].value === undefined) {
          dimensions[names[i]].filter(null);
          // dimensions[names[i]].remove();
        } else {
          let fromVal = action.filter[names[i]].value.from;
          let toVal = action.filter[names[i]].value.to;
          fromVal = fromVal === undefined ? -Infinity : fromVal;
          toVal = toVal === undefined ? Infinity : toVal;
          dimensions[names[i]].filter([fromVal, toVal]);
        }
      } else if (action.filter[names[i]].type === 'regex') {
        // handle regex
      } else if (action.filter[names[i]].type === 'select') {
        // handle select
      }
    }
    const size = store.getState()._cogDataMutable.crossfilter.groupAll().value();
    console.log(`Filtered... size is now ${size}`);
  } else if (action.type === 'SET_SORT') {
    //
    // const cf = store.getState()._cogDataMutable.crossfilter;
    // const dimensions = store.getState()._cogDataMutable.dimensionRefs;
    store.getState();
  }
  return next(action);
};

export default crossfilterMiddleware;
