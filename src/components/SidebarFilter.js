import React from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import { createSelector } from 'reselect';
import { uiConstsSelector } from '../selectors';

const SidebarFilter = ({ style, filter }) => {
  const fKeys = Object.keys(filter);
  let content = <div style={style}>todo</div>;
  if (fKeys.length > 0) {
    const filter1 = filter[fKeys[0]];
    content = <div style={style}>{filter1.name} {filter1.type}</div>;
    content = <div style={style}>todo</div>;
  }
  return (content);
};

SidebarFilter.propTypes = {
  style: React.PropTypes.object,
  filter: React.PropTypes.object
};

// ------ redux container ------

const filterSelector = state => state.filter;
// const dispSelector = state => state._displayInfo;

const stateSelector = createSelector(
  uiConstsSelector, filterSelector,
  (ui, filter) => ({
    style: {
      padding: 10
    },
    filter
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(SidebarFilter));
