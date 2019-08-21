import {
  SELECT_DISPLAY, SET_LAYOUT, SET_LABELS
} from './constants';

// this updates the window hash whenever the state changes
export const hashFromState = (state) => {
  // display
  const display = state.selectedDisplay;
  // layout
  const { layout } = state;
  const layoutPars = `nrow=${layout.nrow}&ncol=${layout.ncol}&arr=${layout.arrange}&pg=${layout.pageNum}`;
  // labels
  const { labels } = state;
  // sort
  const { sort } = state; // TODO: should this be a deep copy?
  sort.sort((a, b) => ((a.order > b.order) ? 1 : -1));
  const sortStr = sort.map((d) => `${d.name};${d.dir}`).join(',');
  // filter
  const { filter } = state;
  const filterStrs = Object.keys(filter.state).map((k) => {
    const flt = filter.state[k];
    let res = '';
    if (flt.type === 'select') {
      res = `var:${flt.name};type:select;val:${flt.value.join('#')}`;
    } else if (flt.type === 'regex') {
      res = `var:${flt.name};type:regex;val:${flt.regex}`;
    } else if (flt.type === 'range') {
      const from = flt.value.from ? flt.value.from : '';
      const to = flt.value.to ? flt.value.to : '';
      res = `var:${flt.name};type:range;from:${from};to:${to}`;
    }
    return res;
  });
  // http://localhost:3000/#display=gapminder_lifeexp&nrow=1&ncol=4&arr=row&pg=5&labels=country,continent,lifeExp_mean&sort=lifeExp_mean;asc&filter=var:continent;type:select;val:Africavar:country;type:regex;val:avar:lifeExp_mean;type:range;from:45.476;to:58.333

  // http://localhost:3000/#display=gapminder_lifeexp&nrow=2&ncol=6&arr=row&pg=1&labels=country,continent,lifeExp_mean&sort=country;asc,continent;asc&
  // filter=
  // var:continent;type:select;val:Africa
  // var:country;type:regex;val:a
  // var:lifeExp_mean;type:range;from:45.476;to:58.333

  const hash = `display=${display.name}&${layoutPars}&labels=${labels.join(',')}&sort=${sortStr}&filter=${filterStrs.join(',')}`;
  return hash;
};

export const hashMiddleware = (store) => (next) => (action) => {
  const types = [SELECT_DISPLAY, SET_LAYOUT, SET_LABELS];
  const result = next(action);
  if (types.indexOf(action.type) > -1) {
    const hash = hashFromState(store.getState());
    if (window.location.hash !== hash) {
      window.history.pushState(hash, undefined, `#${hash}`);
      // window.history.pushState(hash, undefined, '');
    }
  }
  return result;
};
