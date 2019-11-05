import {
  SELECT_DISPLAY, SET_LAYOUT, SET_LABELS, SET_SORT, SET_FILTER, ACTIVE_SIDEBAR,
  SET_FILTER_VIEW, SB_REV_LOOKUP
} from './constants';

// const layoutLookup = {
//   pg: 'pageNum',
//   arr: 'arrange',
//   nrow: 'nrow',
//   ncol: 'ncol'
// };

// this updates the window hash whenever the state changes
export const hashFromState = (state) => {
  // display
  const display = state.selectedDisplay;
  // layout
  const { layout } = state;
  // const layoutPars = Object.keys(layoutLookup).map((el) => (
  //   layout[layoutLookup[el]] ? `${el}=${layout[layoutLookup[el]]}` : ''
  // )).filter((a) => a !== '').join('&');
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
      res = `var:${flt.name};type:select;val:${flt.value.map(encodeURIComponent).join('#')}`;
    } else if (flt.type === 'regex') {
      res = `var:${flt.name};type:regex;val:${encodeURIComponent(flt.regex)}`;
    } else if (flt.type === 'range') {
      const from = flt.value.from ? flt.value.from : '';
      const to = flt.value.to ? flt.value.to : '';
      res = `var:${flt.name};type:range;from:${from};to:${to}`;
    }
    return res;
  });
  // http://localhost:3000/#display=gapminder_lifeexp&nrow=1&ncol=4&arr=row&pg=4&labels=country,continent,lifeExp_mean&sort=lifeExp_mean;asc&filter=var:continent;type:select;val:Africa,var:country;type:regex;val:a,var:lifeExp_mean;type:range;from:45.476;to:58.333

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

export const hashMiddleware = (store) => (next) => (action) => {
  const types = [
    SELECT_DISPLAY, SET_LAYOUT, SET_LABELS, SET_SORT,
    SET_FILTER, ACTIVE_SIDEBAR, SET_FILTER_VIEW
  ];
  const result = next(action);
  if (types.indexOf(action.type) > -1) {
    const hash = hashFromState(store.getState());
    if (window.location.hash !== hash) {
      window.location.hash = hash;
      // window.history.pushState(hash, undefined, `#${hash}`);
      // window.history.pushState(hash, undefined, '');
    }
  }
  return result;
};
