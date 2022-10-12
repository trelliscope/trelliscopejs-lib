import { createSelector } from 'reselect';
import { SB_PANEL_FILTER } from '../constants';
import { filterViewSelector, curDisplayInfoSelector } from '.';
import uiConsts from '../assets/styles/uiConsts';
import { RootState } from '../store';

export const windowWidthSelector = (state: RootState) => state.ui.windowWidth;
export const windowHeightSelector = (state: RootState) => state.ui.windowHeight;
export const origWidthSelector = (state: RootState) => state.ui.origWidth;
export const origHeightSelector = (state: RootState) => state.ui.origHeight;
export const sidebarActiveSelector = (state: RootState) => state.sidebar.active;

export const sidebarHeightSelector = createSelector(
  windowHeightSelector,
  (wh) => wh - uiConsts.header.height - uiConsts.footer.height - uiConsts.sidebar.header.height,
);

// keep track of how high each filter entry is so we can spill over into a new column
export const filterColSplitSelector = createSelector(
  filterViewSelector,
  curDisplayInfoSelector,
  sidebarHeightSelector,
  (filt, cdi, sh) => {
    const keys = filt.active;
    if (keys === undefined) {
      return { cutoff: null, heights: [0, 0] as [number, number] };
    }
    const heights = keys.map((d: string) => {
      // 53 is the extra height of header/footer
      if (!cdi.isLoaded) {
        return 0;
      }
      if (cdi.info.cogInfo[d].type === 'factor') {
        // if the number of levels is small then only make the box that tall
        const nlvl = cdi.info.cogInfo[d].levels ? cdi.info.cogInfo[d].levels.length : 1000;
        return Math.min(uiConsts.sidebar.filter.cat.height, nlvl * 15) + 54;
      }
      if (cdi.info.cogInfo[d].type === 'numeric') {
        return uiConsts.sidebar.filter.num.height + 54;
      }
      return 0;
    });

    let cutoff = null;
    let csum1 = 0;
    let csum2 = 0;

    for (let i = 0; i < heights.length; i += 1) {
      if (cutoff === null) {
        // we're in the first column
        if (csum1 + heights[i] > sh) {
          cutoff = i;
          csum2 += heights[i];
        } else {
          csum1 += heights[i];
        }
      } else {
        csum2 += heights[i];
      }
    }

    // case where it's one column but not enough space for extra variables
    if (cutoff === null && csum1 + 30 + uiConsts.sidebar.filter.variables.height > sh) {
      cutoff = heights.length;
    }

    return {
      cutoff,
      heights: [csum1, csum2] as [number, number],
    };
  },
);

export const contentWidthSelector = createSelector(
  windowWidthSelector,
  sidebarActiveSelector,
  filterColSplitSelector,
  (ww, active, colSplit) => {
    const sw = uiConsts.sidebar.width * (1 + ((active === SB_PANEL_FILTER && colSplit && colSplit.cutoff !== null) ? 1 : 0));
    return ww - uiConsts.sideButtons.width - (active === '' ? 0 : sw + 1);
  },
);

export const contentHeightSelector = createSelector(
  windowHeightSelector,
  (wh) => wh - uiConsts.header.height - uiConsts.footer.height,
);
