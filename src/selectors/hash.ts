// URL hash selectors
//

import { SB_LOOKUP } from '../constants';

// get url hash
export const selectHash = () => {
  const { hash } = window.location;
  // split hash into key/value pairs
  const hashPairs = hash
    .slice(1)
    .split('&')
    .map((d) => d.split('='))
    .map(([key, value]) => [key, decodeURIComponent(value)]);

  // convert to object
  const hashObj = Object.fromEntries(hashPairs);
  return hashObj;
};

// select display from url hash
export const selectHashDisplay = () => {
  const hash = selectHash();
  return hash.display;
};

interface HashLayout {
  type: 'layout';
  nrow?: number;
  ncol?: number;
  arrange?: 'rows' | 'cols';
  page?: number;
}
// select layout from url hash
export const selectHashLayout = (): HashLayout => {
  const hash = selectHash();
  const returnObj: HashLayout = { type: 'layout' };

  const nrow = Number(hash.nrow);
  const ncol = Number(hash.ncol);
  const page = Number(hash.pg);

  if (!Number.isNaN(nrow)) returnObj.nrow = nrow;
  if (!Number.isNaN(ncol)) returnObj.ncol = ncol;
  if (hash.arr) returnObj.arrange = hash.arr;
  if (!Number.isNaN(page)) returnObj.page = page;

  return returnObj;
};

// select labels from url hash
export const selectHashLabels = () => {
  const hash = selectHash();
  if (!hash.labels) return [];
  return hash.labels.split(',');
};

// select sort from url hash
export const selectHashSorts = () => {
  const hash = selectHash();
  if (!hash.sort) return hash.sort;
  return hash.sort.split(',').map((d: string) => {
    const [varname, dir] = d.split(';');
    return { varname, dir };
  });
};

export const selectHashFilters = () => {
  const hash = selectHash();
  if (!hash.filter) return hash.filter;
  return hash.filter.split(',').map((d: string) => {
    const hashProps = {} as { var: string; type: string; [key: string]: string };

    d.split(';').forEach((f: string) => {
      const [key, value] = f.split(':');
      hashProps[key] = value;
    });

    const filter = { varname: hashProps.var, filtertype: hashProps.type, type: 'filter' } as IFilterState;

    if (['numberrange', 'daterange', 'datetimerange'].includes(hashProps.type)) {
      return {
        ...filter,
        min: Number(hashProps.min),
        max: Number(hashProps.max),
      } as INumberRangeFilterState | IDateRangeFilterState | IDatetimeRangeFilterState;
    }

    return {
      ...filter,
      regexp: JSON.parse(decodeURIComponent(hashProps.regexp)),
      values: hashProps.val.split('#').map(decodeURIComponent),
    } as ICategoryFilterState;
  });
};

export const selectHashFilterView = () => {
  const hash = selectHash();
  return hash.fv.split(',');
};

export const selectHashSidebar = () => {
  const hash = selectHash();
  return { active: (SB_LOOKUP[Number(hash.sidebar)] || '') as SidebarType };
};
