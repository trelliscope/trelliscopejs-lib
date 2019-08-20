import { createSelector } from 'reselect';
import { displayListSelector, displayInfoSelector } from '.';

export const relatedDisplaysSelector = createSelector(
  displayInfoSelector, displayListSelector,
  (di, dl) => {
    const res = [];
    if (di.isLoaded) {
      const { keySig } = di.info;
      const dispID = [di.info.group, di.info.name].join('/');
      for (let i = 0; i < dl.list.length; i += 1) {
        const sameKey = dl.list[i].keySig === keySig;
        const curID = [dl.list[i].group, dl.list[i].name].join('/');
        if (sameKey && curID !== dispID) {
          res.push({ name: dl.list[i].name, group: dl.list[i].group });
        }
      }
    }
    return res;
  }
);

export const cogInfoSelector = createSelector(
  displayInfoSelector,
  (di) => (
    di.info.cogInfo ? di.info.cogInfo : {}
  )
);

export const displayGroupsSelector = createSelector(
  displayListSelector,
  (dl) => {
    const dispGroups = {};
    if (dl.list) {
      for (let ii = 0; ii < dl.list.length; ii += 1) {
        if (!dispGroups[dl.list[ii].group]) {
          dispGroups[dl.list[ii].group] = [];
        }
        dispGroups[dl.list[ii].group].push(ii);
      }
    }
    return dispGroups;
  }
);
