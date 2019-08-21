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
  const { sort } = state;
  sort.sort((a, b) => ((a.order > b.order) ? 1 : -1));
  const sortStr = sort.map((d) => `${d.name};${d.dir}`).join(',');

  const hash = `display=${display.name}&${layoutPars}&labels=${labels.join(',')}&sort=${sortStr}`;
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
