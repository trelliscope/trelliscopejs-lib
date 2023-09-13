import { createSelector } from 'reselect';
import type { RootState } from '../store';
import getCustomProperties from '../getCustomProperties';

const [headerHeight, footerHeight] = getCustomProperties([
  '--header-height',
  '--footer-height',
  '--sidebar-width',
  '--sidebar-filter-cat-height',
  '--sidebar-filter-num-height',
  '--sidebar-filter-variables-height',
]) as number[];

export const windowWidthSelector = (state: RootState) => state.ui.windowWidth;
export const windowHeightSelector = (state: RootState) => state.ui.windowHeight;
export const origWidthSelector = (state: RootState) => state.ui.origWidth;
export const origHeightSelector = (state: RootState) => state.ui.origHeight;

export const sidebarHeightSelector = createSelector(
  windowHeightSelector,
  (wh) => wh - headerHeight - footerHeight - headerHeight,
);

export const contentHeightSelector = createSelector(windowHeightSelector, (wh) => wh - headerHeight - footerHeight);

const numLabelsSelector = (state: RootState) => state.labels.length;
const numColumnsSelector = (state: RootState) => state.layout.ncol;
const showLabelsSelector = (state: RootState) => state.layout.showLabels;

interface PanelLabelSizeProps {
  fontSize: number;
  padding: number;
  lineHeight: number;
  rowHeight: number;
}

const panelLabelSize = {
  sm: {
    fontSize: 8,
    padding: 1,
    lineHeight: 8 * 1.5,
    rowHeight: 8 * 1.5 + 1 * 2 + 1,
  },
  md: {
    fontSize: 10,
    padding: 3,
    lineHeight: 10 * 1.5,
    rowHeight: 10 * 1.5 + 3 * 2 + 1,
  },
  lg: {
    fontSize: 12,
    padding: 4,
    lineHeight: 12 * 1.5,
    rowHeight: 12 * 1.5 + 4 * 2 + 1,
  },
};

export const panelLabelSizeSelector = createSelector(numLabelsSelector, numColumnsSelector, showLabelsSelector, (nl, nc, sl) => {
  let size = {} as PanelLabelSizeProps;
  if (nl <= 6) {
    if (nc <= 4) {
      size = panelLabelSize.lg;
    } else if (nc <= 6) {
      size = panelLabelSize.md;
    } else {
      size = panelLabelSize.sm;
    }
  } else if (nl <= 10) {
    if (nc <= 3) {
      size = panelLabelSize.md;
    } else {
      size = panelLabelSize.sm;
    }
  } else {
    size = panelLabelSize.sm;
  }
  // size.lineHeight = size.fontSize * 1.5;
  // size.rowHeight = size.lineHeight + size.padding * 2 + 1;
  return size;
});
