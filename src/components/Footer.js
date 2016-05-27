import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { uiConstsSelector, windowWidthSelector } from '../selectors';

const Footer = ({ style }) => (
  <div style={style}>
  </div>
);

Footer.propTypes = {
  style: React.PropTypes.object
};

// ------ redux container ------

const styleSelector = createSelector(
  windowWidthSelector, uiConstsSelector,
  (ww, ui) => ({
    style: {
      position: 'absolute',
      boxSizing: 'border-box',
      bottom: 0,
      left: 0,
      width: ww,
      height: ui.footer.height,
      paddingLeft: 10,
      margin: 0,
      lineHeight: `${ui.footer.height}px`,
      fontSize: ui.footer.height * 0.5,
      fontWeight: 300,
      background: ui.footer.background,
      color: ui.footer.color
    }
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Footer);
