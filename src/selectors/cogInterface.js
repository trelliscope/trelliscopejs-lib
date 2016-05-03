import { createSelector } from 'reselect';

export const pageNumSelector = state => state.pageNum;
export const nPerPageSelector = state => state.layout.nrow * state.layout.ncol;
export const cogInterfaceSelector = state => state._cogInterface;
export const filterSelector = state => state.filter;
export const sortSelector = state => state.sort;
export const layoutSelector = state => state.layout;
export const labelsSelector = state => state.labels;
export const aspectSelector = state =>
  state._displayInfo.info.height / state._displayInfo.info.width;

const keepRecord = (rec, filt) => {
  let keep = true;
  switch (filt.type) {
    case 'regex':
      if (rec.match(filt.value) === null) {
        keep = false;
      }
      break;
    case 'range':
      if (filt.value.from && rec < filt.value.from) {
        keep = false;
      }
      if (filt.value.to && rec > filt.value.to) {
        keep = false;
      }
      break;
    case 'select':
      if (filt.value.indexOf(rec) < 0) {
        keep = false;
      }
      break;
    default:
  }
  return keep;
};

const sortFn = (property) => {
  let sortOrder = 1;
  let property2 = property;
  if (property[0] === '!') {
    sortOrder = -1;
    property2 = property2.substr(1);
  }
  return (a, b) => {
    const result = (a[property2] < b[property2]) ? -1 : (a[property2] > b[property2]) ? 1 : 0;
    return result * sortOrder;
  };
};

const multiSort = (args) => {
  const props = args;
  return (obj1, obj2) => {
    let i = 0;
    let result = 0;
    while (result === 0 && i < props.length) {
      result = sortFn(props[i])(obj1, obj2);
      i++;
    }
    return result;
  };
};

export const JSONFilterIndexSelector = createSelector(
  cogInterfaceSelector, filterSelector,
  (ci, filter) => {
    const result = [];
    if (ci.iface && ci.info && ci.iface.type === 'JSON') {
      for (let i = 0; i < ci.info.panelKey.length; i++) {
        let keep = true;
        for (let j = 0; j < filter.length; j++) {
          keep = keep && keepRecord(ci.info[filter[j].name][i], filter[j]);
        }
        if (keep) {
          result.push(i);
        }
      }
    }
    return result;
  }
);

export const JSONFilteredSortedIndexSelector = createSelector(
  cogInterfaceSelector, JSONFilterIndexSelector, sortSelector,
  (ci, idx, sort) => {
    const result = [];
    if (ci.iface && ci.info && ci.iface.type === 'JSON') {
      const cur = [];
      for (let i = 0; i < idx.length; i++) {
        const elem = { idx: idx[i] };
        for (let j = 0; j < sort.length; j++) {
          elem[sort[j].name] = ci.info[sort[j].name][idx[i]];
        }
        cur.push(elem);
      }
      const sortSpec = [];
      for (let i = 0; i < sort.length; i++) {
        sortSpec.push(`${sort[i].dir === 'asc' ? '' : '!'}${sort[i].name}`);
      }
      cur.sort(multiSort(sortSpec));
      for (let i = 0; i < cur.length; i++) {
        result.push(cur[i].idx);
      }
    }
    return result;
  }
);

export const currentJSONIndexSelector = createSelector(
  cogInterfaceSelector, JSONFilteredSortedIndexSelector,
  pageNumSelector, nPerPageSelector,
  (ci, keys, pnum, npp) => {
    let result = [];
    if (ci.iface && ci.info && ci.iface.type === 'JSON') {
      const start = (pnum - 1) * npp;
      const end = npp * pnum;
      result = keys.slice(start, end);
    }
    return result;
  }
);
