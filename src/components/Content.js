import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { uiConstsSelector, contentWidthSelector, contentHeightSelector } from '../selectors';

const Content = ({ style }) => (
  <div style={style}>
  </div>
);

Content.propTypes = {
  style: React.PropTypes.object
};

// ------ redux container ------

const styleSelector = createSelector(
  contentWidthSelector, contentHeightSelector, uiConstsSelector,
  (cw, ch, ui) => ({
    style: {
      position: 'absolute',
      top: ui.header.height,
      right: 0,
      boxSizing: 'border-box',
      padding: 10,
      // border: '3px solid red',
      width: cw,
      height: ch
    }
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Content);
