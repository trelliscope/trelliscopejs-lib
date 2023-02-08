// ignore all ts errors in this file
// FIXME remove this once refactor is done with new architecture
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import SidebarLabels from '../SidebarLabels';
import SidebarLayout from '../SidebarLayout';
import SidebarSort from '../SidebarSort';
import SidebarViews from '../SidebarViews';
import { contentHeightSelector, sidebarActiveSelector } from '../../selectors/ui';
import { labelsSelector } from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_CONFIG, SB_VIEWS } from '../../constants';
import getCustomProperties from '../../getCustomProperties';
import { setLabels } from '../../slices/labelsSlice';
import { selectSort } from '../../slices/sortSlice';
import styles from './Sidebar.module.scss';
import { useDisplayInfo, useDisplayMetasLabels } from '../../slices/displayInfoAPI';
import SidebarFilter from '../SidebarFilter';

const Sidebar: React.FC = () => {
  const [sidebarHeaderHeight] = getCustomProperties(['--sidebar-header-height']) as number[];
  const [sidebarWidth] = getCustomProperties(['--sidebar-width']) as number[];
  const dispatch = useDispatch();
  const { isSuccess: displayLoaded } = useDisplayInfo();
  const contentHeight = useSelector(contentHeightSelector);
  const active = useSelector(sidebarActiveSelector);
  const labels = useSelector(labelsSelector);
  const sort = useSelector(selectSort);
  const metaLabels = useDisplayMetasLabels();
  const ch = useSelector(contentHeightSelector);

  const handleLabelChange = (value: string) => {
    const idx = labels.indexOf(value);
    let newLabels = labels;
    if (idx === -1) {
      newLabels = [...labels, value];
    } else {
      newLabels = [...labels.slice(0, idx), ...labels.slice(idx + 1)];
    }
    dispatch(setLabels(newLabels));
  };

  const notUsed = Object.keys(metaLabels);
  if (metaLabels) {
    for (let i = 0; i < sort.length; i += 1) {
      const index = notUsed.indexOf(sort[i].name);
      if (index > -1) {
        notUsed.splice(index, 1);
      }
    }
  }

  const customStyles = {
    sidebarContainer: {
      width: sidebarWidth,
      height: contentHeight,
    },
  };

  return (
    <div
      className={classNames(active === '' ? [styles.sidebarHidden, styles.sidebarContainer] : styles.sidebarContainer)}
      style={customStyles.sidebarContainer}
    >
      <div className={styles.sidebarHeader}>{active}</div>
      {active === SB_CONFIG && <div className={styles.sidebarEmpty}>Configuration...</div>}
      {!displayLoaded && <div className={styles.sidebarEmpty}>Load a display...</div>}
      {active === SB_PANEL_LAYOUT && displayLoaded && <SidebarLayout />}
      {active === SB_PANEL_FILTER && displayLoaded && <SidebarFilter />}
      {active === SB_PANEL_SORT && displayLoaded && <SidebarSort />}
      {active === SB_PANEL_LABELS && displayLoaded && (
        <SidebarLabels
          sidebarHeaderHeight={sidebarHeaderHeight}
          ch={ch}
          labels={labels}
          handleLabelChange={handleLabelChange}
        />
      )}
      {active === SB_VIEWS && displayLoaded && <SidebarViews />}
    </div>
  );
};

export default Sidebar;
