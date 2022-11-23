import React from 'react';
import { useSelector } from 'react-redux';
import SidebarLabels from '../SidebarLabels';
import SidebarLayout from '../SidebarLayout';
import SidebarSort from '../SidebarSort';
import SidebarFilter from '../SidebarFilter';
import SidebarViews from '../SidebarViews';
import { contentHeightSelector, sidebarActiveSelector, filterColSplitSelector } from '../../selectors/ui';
import { displayLoadedSelector } from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_CONFIG, SB_VIEWS } from '../../constants';
import getCustomProperties from '../../getCustomProperties';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  const [sidebarWidth] = getCustomProperties(['--sidebar-width']) as number[];

  const contentHeight = useSelector(contentHeightSelector);
  const active = useSelector(sidebarActiveSelector);
  const displayLoaded = useSelector(displayLoadedSelector);
  const filterColSplit = useSelector(filterColSplitSelector);

  const customStyles = {
    sidebarContainer: {
      width: sidebarWidth * (1 + (active === SB_PANEL_FILTER && filterColSplit && filterColSplit.cutoff !== null ? 1 : 0)),
      height: contentHeight,
    },
  };

  if (active === '') {
    return <div className={`${styles.sidebarContainer} ${styles.sidebarHidden}`} style={customStyles.sidebarContainer} />;
  }

  let content;
  if (active === SB_CONFIG) {
    content = <div className={styles.sidebarEmpty}>Configuration...</div>;
  } else if (!displayLoaded) {
    content = <div className={styles.sidebarEmpty}>Load a display...</div>;
  } else {
    switch (active) {
      case SB_PANEL_LAYOUT:
        content = (
          <div>
            <SidebarLayout />
          </div>
        );
        break;
      case SB_PANEL_FILTER:
        content = (
          <div>
            <SidebarFilter />
          </div>
        );
        break;
      case SB_PANEL_SORT:
        content = (
          <div>
            <SidebarSort />
          </div>
        );
        break;
      case SB_PANEL_LABELS:
        content = (
          <div>
            <SidebarLabels />
          </div>
        );
        break;
      case SB_VIEWS:
        content = (
          <div>
            <SidebarViews />
          </div>
        );
        break;
      default:
        content = '';
    }
  }

  return (
    <div className={styles.sidebarContainer} style={customStyles.sidebarContainer}>
      <div className={styles.sidebarHeader}>{active}</div>
      {content}
    </div>
  );
};

export default Sidebar;
