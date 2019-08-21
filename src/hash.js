import {
  SELECT_DISPLAY, SET_LAYOUT, SET_LABELS
} from './constants';

// import {
//   setSelectedDisplay, setLayout, setLabels
// } from './actions';

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

export const setStateFromHash = (store, hash) => {
  // const state = store.getState();
  // const { layout } = state;

  const hashItems = {};
  hash.replace('#', '').split('&').forEach((d) => {
    const tuple = d.split('=');
    hashItems[tuple[0]] = tuple[[1]];
  });

  // if (hashItems.nrow !== undefined) {
  //   store.dispatch(setLayout({ nrow: parseInt(hashItems.nrow, 10) }));
  // }

  // if (hashItems.from !== undefined && hashItems.to !== undefined) {
  //   let from = parseInt(hashItems.from, 10);
  //   let to = parseInt(hashItems.to, 10);
  //   if (from === 40 * 7) {
  //     from = 40 * 7 - 1;
  //   }
  //   if (to === 40 * 7) {
  //     to = 40 * 7 - 1;
  //   }
  //   const newAgeRange = [from / 7, to / 7];
  //   if (newAgeRange[0] !== ageRange[0] || newAgeRange[1] !== ageRange[1]) {
  //     store.dispatch({
  //       type: SET_AGE_RANGE,
  //       val: newAgeRange
  //     });
  //   }
  // }

  // if (hashItems.nd !== undefined && hashItems.ogm !== undefined) {
  //   if (hashItems.nd !== nd.join(',') || hashItems.ogm !== ogm.join(',')) {
  //     let newNd = [];
  //     let newOgm = [];
  //     if (hashItems.nd.length > 0) {
  //       newNd = hashItems.nd.split(',');
  //     }
  //     if (hashItems.ogm.length > 0) {
  //       newOgm = hashItems.ogm.split(',');
  //     }
  //     store.dispatch(setFilters({ type: 'replace-all', val: { nd: newNd, ogm: newOgm } }));
  //   }
  // }

  // if (hashItems.ho !== undefined && hashItems.int !== undefined && hashItems.rf !== undefined) {
  //   if (hashItems.ho !== ho.join(',') || hashItems.int !== int.join(',') || hashItems.rf !== rf.join(',')) {
  //     let newHo = [];
  //     let newInt = [];
  //     let newRf = [];
  //     if (hashItems.ho.length > 0) {
  //       newHo = hashItems.ho.split(',');
  //     }
  //     if (hashItems.int.length > 0) {
  //       newInt = hashItems.int.split(',');
  //     }
  //     if (hashItems.rf.length > 0) {
  //       newRf = hashItems.rf.split(',');
  //     }
  //     store.dispatch(setSelectedORFI({ type: 'replace-all', val: { ho: newHo, int: newInt, rf: newRf } }));
  //   }
  // }

  // if (hashItems.cgs !== undefined && hashItems.cgs !== cgs.join(',') && hashItems.cgs.length > 0) {
  //   store.dispatch(setCollapsedGroup({ type: 'set-all', val: hashItems.cgs.split(',') }));
  // }

  // if (hashItems.pnd !== undefined && hashItems.pnd !== pnd && hashItems.pnd.length > 0) {
  //   const pndItems = hashItems.pnd.split(',');
  //   const pinned = pndItems.map((d) => {
  //     const els = d.split(';');
  //     return {
  //       uid: els[0],
  //       class: els[1],
  //       subcat: code2subcat(els[2]),
  //       i: els[3]
  //     };
  //   });
  //   store.dispatch(setAllPinned(pinned));
  // }
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
