import React from 'react';
import PropTypes from 'prop-types';
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
import styles from './Sidebar.module.scss';

const Sidebar = ({ customStyles, active, displayLoaded }) => {
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

Sidebar.propTypes = {
  customStyles: PropTypes.object.isRequired,
  active: PropTypes.string.isRequired,
  displayLoaded: PropTypes.bool.isRequired,
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
        width: uiConsts.sidebar.width * (1 + (active === SB_PANEL_FILTER && colSplit && colSplit.cutoff !== null)),
        height: ch,
      },
    },
    active,
    displayLoaded,
  }),
);

const mapStateToProps = (state) => stateSelector(state);

export default connect(mapStateToProps)(Sidebar);
