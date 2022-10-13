import React from 'react';
import type { CSSProperties } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import SidebarLabels from '../SidebarLabels';
import SidebarLayout from '../SidebarLayout';
import SidebarSort from '../SidebarSort';
import SidebarFilter from '../SidebarFilter';
import SidebarViews from '../SidebarViews';
import { contentHeightSelector, sidebarActiveSelector, filterColSplitSelector } from '../../selectors/ui';
import { displayLoadedSelector } from '../../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT, SB_PANEL_LABELS, SB_CONFIG, SB_VIEWS } from '../../constants';
import uiConsts from '../../assets/styles/uiConsts';
import { RootState } from '../../store';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  customStyles: { [key: string]: CSSProperties };
  active: string;
  displayLoaded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ customStyles, active, displayLoaded }) => {
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

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector,
  sidebarActiveSelector,
  displayLoadedSelector,
  filterColSplitSelector,
  (ch, active, displayLoaded, colSplit) => ({
    customStyles: {
      sidebarContainer: {
        width: uiConsts.sidebar.width * (1 + (active === SB_PANEL_FILTER && colSplit && colSplit.cutoff !== null ? 1 : 0)),
        height: ch,
      },
    },
    active,
    displayLoaded,
  }),
);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: TS2345
const mapStateToProps = (state: RootState) => stateSelector(state);

export default connect(mapStateToProps)(Sidebar);
