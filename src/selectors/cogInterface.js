import { createSelector } from 'reselect';
import { displayInfoSelector } from './display';

export const pageNumSelector = state => state.layout.pageNum;
export const nPerPageSelector = state => state.layout.nrow * state.layout.ncol;
export const cogInterfaceSelector = state => state._cogInterface;
export const filterStateSelector = state => state.filter.state;
export const sortSelector = state => state.sort;
export const layoutSelector = state => state.layout;
export const labelsSelector = state => state.labels;
export const aspectSelector = state =>
  state._displayInfo.info.height / state._displayInfo.info.width;

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

export const JSONFilterIndexSelector = createSelector(
  cogInterfaceSelector, filterStateSelector,
  (ci, filter) => {
    const result = [];
    const keys = Object.keys(filter);
    if (ci.iface && ci.info && ci.iface.type === 'JSON') {
      for (let i = 0; i < ci.info.panelKey.length; i++) {
        let keep = true;
        for (let j = 0; j < keys.length; j++) {
          keep = keep && keepRecord(ci.info[filter[keys[j]].name][i], filter[keys[j]]);
        }
        if (keep) {
          result.push(i);
        }
      }
    }
    return result;
  }
);

export const JSONFiltDistSelector = createSelector(
  cogInterfaceSelector, JSONFilterIndexSelector, filterStateSelector,
  displayInfoSelector,
  (ci, idx, filter, di) => {
    const result = {};
    if (ci.iface && ci.info && ci.iface.type === 'JSON') {
      // for every active filter, calculate the conditional distribution
      const keys = Object.keys(filter);
      for (let i = 0; i < keys.length; i++) {
        if (filter[keys[i]].varType === 'factor') {
          const cur = {};
          let maxVal = 0;
          for (let j = 0; j < idx.length; j++) {
            if (!cur[ci.info[keys[i]][idx[j]]]) {
              cur[ci.info[keys[i]][idx[j]]] = 1;
            } else {
              cur[ci.info[keys[i]][idx[j]]]++;
            }
            if (cur[ci.info[keys[i]][idx[j]]] > maxVal) {
              maxVal = cur[ci.info[keys[i]][idx[j]]];
            }
          }
          const orderValue = filter[keys[i]].orderValue ?
            filter[keys[i]].orderValue : 'ct,desc';
          let orderKeys = [];
          let morderKeys = [];

          // if filter is 'select' type and some selections are
          // completely filtered out, they need to be captured here
          const interKeys = Object.keys(cur);
          const newKeys = [];
          if (filter[keys[i]].type === 'select') {
            for (let j = 0; j < filter[keys[i]].value.length; j++) {
              const curKey = filter[keys[i]].value[j];
              if (interKeys.indexOf(curKey) < 0) {
                cur[curKey] = 0;
                newKeys.push(curKey);
              }
            }
          }
          const curKeys = interKeys.concat(newKeys);
          const mdist = di.info.cogDistns[keys[i]].dist;
          const mdistKeys = Object.keys(mdist);

          for (let j = 0; j < curKeys.length; j++) {
            const kIndex = mdistKeys.indexOf(curKeys[j]);
            if (kIndex > -1) {
              mdistKeys.splice(kIndex, 1);
            }
          }

          switch (orderValue) {
            case 'ct,desc':
              curKeys.sort((a, b) => cur[b] - cur[a]);
              mdistKeys.sort((a, b) => mdist[b] - mdist[a]);
              break;
            case 'ct,asc':
              curKeys.sort((a, b) => cur[a] - cur[b]);
              mdistKeys.sort((a, b) => mdist[a] - mdist[b]);
              break;
            case 'id,desc':
              orderKeys = curKeys.sort().reverse();
              morderKeys = mdistKeys.sort().reverse();
              break;
            case 'id,asc':
              orderKeys = curKeys.sort();
              morderKeys = mdistKeys.sort();
              break;
            default:
              break;
          }

          result[keys[i]] = {
            dist: cur,
            orderKeys: curKeys,
            morderKeys: mdistKeys,
            max: maxVal,
            orderValue,
            activeTot: idx.length
          };
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

export const JSONFilterCardinalitySelector = createSelector(
  JSONFilterIndexSelector,
  (ci) => ci.length
);
