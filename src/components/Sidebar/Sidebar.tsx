// ignore all ts errors in this file
// FIXME remove this once refactor is done with new architecture
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import SidebarLabels from '../SidebarLabels';
import SidebarLayout from '../SidebarLayout';
import SidebarSort from '../SidebarSort';
import SidebarViews from '../SidebarViews';
import { sidebarActiveSelector } from '../../selectors/ui';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_CONFIG, SB_VIEWS } from '../../constants';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import SidebarFilter from '../SidebarFilter';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  const { isSuccess: displayLoaded } = useDisplayInfo();
  const active = useSelector(sidebarActiveSelector);

  return (
    <div className={classNames(active === '' ? [styles.sidebarHidden, styles.sidebarContainer] : styles.sidebarContainer)}>
      <div className={styles.sidebarHeader}>{active}</div>
      {active === SB_CONFIG && <div className={styles.sidebarEmpty}>Configuration...</div>}
      {!displayLoaded && <div className={styles.sidebarEmpty}>Load a display...</div>}
      {active === SB_PANEL_LAYOUT && displayLoaded && <SidebarLayout />}
      {active === SB_PANEL_FILTER && displayLoaded && <SidebarFilter />}
      {active === SB_PANEL_SORT && displayLoaded && <SidebarSort />}
      {active === SB_PANEL_LABELS && displayLoaded && <SidebarLabels />}
      {active === SB_VIEWS && displayLoaded && <SidebarViews />}
    </div>
  );
};

export default Sidebar;
