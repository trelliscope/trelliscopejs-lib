import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { uiConstsSelector, contentHeightSelector, sidebarActiveSelector } from '../selectors';
import SidebarLabels from './SidebarLabels';
import SidebarLayout from './SidebarLayout';
import SidebarSort from './SidebarSort';
import SidebarFilter from './SidebarFilter';
import { SB_PANEL_LAYOUT, SB_PANEL_FILTER, SB_PANEL_SORT,
  SB_PANEL_LABELS, SB_CONFIG } from '../constants.js';

const Sidebar = ({ style, active, displayLoaded }) => {
  if (active === '') {
    return <div style={[style.base, style.hidden]}></div>;
  }

  const emptyStyle = { paddingLeft: 8, paddingTop: 5 };
  let content;
  if (active === SB_CONFIG) {
    content = <div style={emptyStyle}>Configuration...</div>;
  } else {
    if (!displayLoaded) {
      content = <div style={emptyStyle}>Load a display...</div>;
    } else {
      switch (active) {
        case SB_PANEL_LAYOUT:
          content = <SidebarLayout />;
          break;
        case SB_PANEL_FILTER :
          content = <SidebarFilter />;
          break;
        case SB_PANEL_SORT :
          content = <SidebarSort />;
          break;
        case SB_PANEL_LABELS :
          content = <SidebarLabels />;
          break;
        default:
          content = '';
      }
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

const displayLoadedSelector = state => state._displayInfo.isLoaded;

const stateSelector = createSelector(
  contentHeightSelector, uiConstsSelector, sidebarActiveSelector, displayLoadedSelector,
  (ch, ui, active, displayLoaded) => ({
    style: {
      base: {
        position: 'absolute',
        left: ui.sideButtons.width,
        top: ui.header.height,
        width: ui.sidebar.width,
        height: ch,
        visibility: 'visible',
        opacity: 1,
        borderRight: '1px solid',
        borderColor: ui.sidebar.borderColor,
        transition: 'opacity 0.25s ease, visibility 0.5s ease'
      },
      hidden: {
        visibility: 'hidden',
        opacity: 0,
        transition: 'opacity 0.25s ease, visibility 0.5s ease'
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
