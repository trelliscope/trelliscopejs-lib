import { createSelector } from 'reselect';

export const displayListSelector = state => state._displayList;
export const displayInfoSelector = state => state._displayInfo;
export const currentDisplaySelector = state => state.currentDisplay;

export const relatedDisplaysSelector = createSelector(
  displayInfoSelector, displayListSelector,
  (di, dl) => {
    const res = [];
    if (di.isLoaded) {
      const keySig = di.info.keySig;
      const dispID = [di.info.group, di.info.name].join('/');
      for (let i = 0; i < dl.list.length; i++) {
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

export const cogInfoObjSelector = createSelector(
  displayInfoSelector,
  (di) => {
    const res = {};
    if (di.info.cogInfo) {
      for (let i = 0; i < di.info.cogInfo.length; i++) {
        res[di.info.cogInfo[i].name] = di.info.cogInfo[i];
      }
    }
    return (res);
  }
);
