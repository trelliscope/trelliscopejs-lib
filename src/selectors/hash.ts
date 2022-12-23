// URL hash selectors
//

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

// select layout from url hash
export const selectHashLayout = () => {
  const hash = selectHash();
  const returnObj: { nrow?: number; ncol?: number; arrange?: 'rows' | 'cols'; page?: number } = {};

  const nrow = Number(hash.nrow);
  const ncol = Number(hash.ncol);
  const page = Number(hash.pg);

  if (!Number.isNaN(nrow)) returnObj.nrow = Number(hash.nrow);
  if (!Number.isNaN(ncol)) returnObj.ncol = Number(hash.ncol);
  if (hash.arr) returnObj.arrange = hash.arr;
  if (!Number.isNaN(page)) returnObj.page = Number(hash.pg);

  return returnObj;
};

// select labels from url hash
export const selectHashLabels = () => {
  const hash = selectHash();
  if (!hash.labels) return [];
  return hash.labels.split(',');
};

// select sort from url hash
export const selectHashSort = () => {
  const hash = selectHash();
  if (!hash.sort) return hash.sort;
  return hash.sort.split(',').map((d) => {
    const [varname, dir] = d.split(';');
    return { varname, dir };
  });
};
