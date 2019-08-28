import { createSelector } from 'reselect';
import { displayListSelector, displayInfoSelector } from '.';

export const relatedDisplayGroupsSelector = createSelector(
  displayInfoSelector, displayListSelector,
  (di, dl) => {
    const res = {};
    if (di.isLoaded) {
      const { keySig } = di.info;
      const dispID = [di.info.group, di.info.name].join('/');
      dl.list.forEach((d, i) => {
        const sameKey = d.keySig === keySig;
        const curID = [d.group, d.name].join('/');
        if (sameKey && curID !== dispID) {
          if (!res[d.group]) {
            res[d.group] = [];
          }
          res[d.group].push(i);
        }
      });
    }
    return res;
  }
);

export const selectedRelDispsSelector = (state) => state.selectedRelDisps;

export const displayAspectsSelector = createSelector(
  displayInfoSelector, displayListSelector, selectedRelDispsSelector,
  (di, dl, srd) => {
    const res = [];
    if (dl.isLoaded && di.isLoaded) {
      res.push({
        aspect: di.info.height / di.info.width,
        group: di.info.group,
        name: di.info.name
      });
    }
    srd.forEach((i) => {
      res.push({
        aspect: dl.list[i].height / dl.list[i].width,
        group: dl.list[i].group,
        name: dl.list[i].name
      });
    });
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
