import React from 'react';
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { windowWidthSelector, windowHeightSelector } from '../selectors/ui';
import SideButtons from './SideButtons';
import Sidebar from './Sidebar';
import Content from './Content';
import uiConsts from '../styles/uiConsts';

const Body = ({ sheet: { classes }, width, height }) => (
  <div className={classes.body} style={{ width, height }}>
    <SideButtons />
    <Sidebar />
    <Content />
  </div>
);

Body.propTypes = {
  sheet: React.PropTypes.object,
  width: React.PropTypes.number,
  height: React.PropTypes.number
};

// ------ static styles ------

const staticStyles = {
  body: {
    position: 'fixed',
    top: 0,
    left: 0
  }
};

// ------ redux container ------

const stateSelector = createSelector(
  windowWidthSelector, windowHeightSelector,
  (width, height) => ({
    width,
    height
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(injectSheet(staticStyles)(Body));
