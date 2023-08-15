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
