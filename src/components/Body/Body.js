import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { windowWidthSelector, windowHeightSelector } from '../../selectors/ui';
import SideButtons from '../SideButtons';
import Sidebar from '../Sidebar';
import Content from '../Content';
import styles from './Body.module.scss';

const Body = ({ width, height }) => (
  <div className={styles.body} style={{ width, height }}>
    <SideButtons />
    <Sidebar />
    <Content />
  </div>
);

Body.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

// ------ redux container ------

const stateSelector = createSelector(windowWidthSelector, windowHeightSelector, (width, height) => ({
  width,
  height,
}));

const mapStateToProps = (state) => stateSelector(state);

export default connect(mapStateToProps)(Body);
