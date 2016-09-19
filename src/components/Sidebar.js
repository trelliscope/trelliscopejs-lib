import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import SidebarLabels from './SidebarLabels';
import SidebarLayout from './SidebarLayout';
import SidebarSort from './SidebarSort';
import SidebarFilter from './SidebarFilter';
import { uiConstsSelector, contentHeightSelector,
  sidebarActiveSelector, filterColSplitSelector } from '../selectors/ui';
import { displayLoadedSelector } from '../selectors';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT,
  SB_PANEL_LABELS, SB_CONFIG } from '../constants';

const Sidebar = ({ style, active, displayLoaded }) => {
  if (active === '') {
    return <div style={[style.base, style.hidden]} />;
  }

  const emptyStyle = { paddingLeft: 8, paddingTop: 5 };
  let content;
  if (active === SB_CONFIG) {
    content = <div style={emptyStyle}>Configuration...</div>;
  } else if (!displayLoaded) {
    content = <div style={emptyStyle}>Load a display...</div>;
  } else {
    switch (active) {
      case SB_PANEL_LAYOUT:
        content = <div><SidebarLayout /></div>;
        break;
      case SB_PANEL_FILTER :
        content = <div><SidebarFilter /></div>;
        break;
      case SB_PANEL_SORT :
        content = <div><SidebarSort /></div>;
        break;
      case SB_PANEL_LABELS :
        content = <div><SidebarLabels /></div>;
        break;
      default:
        content = '';
    }
  }

  return (
    <div style={style.base}>
      <div style={style.header}>{active}</div>
      {content}
    </div>
  );
};

Sidebar.propTypes = {
  style: React.PropTypes.object,
  active: React.PropTypes.string,
  displayLoaded: React.PropTypes.bool
};

// ------ redux container ------

const stateSelector = createSelector(
  contentHeightSelector, uiConstsSelector, sidebarActiveSelector,
  displayLoadedSelector, filterColSplitSelector,
  (ch, ui, active, displayLoaded, colSplit) => ({
    style: {
      base: {
        transitionProperty: 'left',
        transitionDuration: ui.trans.duration,
        transitionTimingFunction: ui.trans.timing,
        position: 'absolute',
        left: ui.sideButtons.width,
        top: ui.header.height,
        width: ui.sidebar.width * (1 + (active === SB_PANEL_FILTER && colSplit.cutoff !== null)),
        boxSizing: 'border-box',
        height: ch,
        borderRight: '1px solid',
        borderColor: ui.sidebar.borderColor,
        background: '#fff',
        zIndex: 999
      },
      hidden: {
        transitionProperty: 'left',
        transitionDuration: ui.trans.duration,
        transitionTimingFunction: ui.trans.timing,
        left: ui.sideButtons.width - ui.sidebar.width
      },
      header: {
        paddingLeft: 10,
        boxSizing: 'border-box',
        fontSize: ui.sidebar.header.fontSize,
        background: ui.sidebar.header.background,
        height: ui.sidebar.header.height,
        lineHeight: `${ui.sidebar.header.height}px`,
        color: ui.sidebar.header.color,
        borderLeft: '1px solid #ccc'
      }
    },
    active,
    displayLoaded
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(Sidebar));
