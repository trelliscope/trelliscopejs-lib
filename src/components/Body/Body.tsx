import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { windowWidthSelector, windowHeightSelector } from '../../selectors/ui';
import SideButtons from '../SideButtons';
import Sidebar from '../Sidebar';
import Content from '../Content';
import styles from './Body.module.scss';
import { RootState } from '../../store';

interface BodyProps {
  width: number;
  height: number;
}

const Body: React.FC<BodyProps> = ({ width, height }) => (
  <div className={styles.body} style={{ width, height }}>
    <SideButtons />
    <Sidebar />
    <Content />
  </div>
);

// ------ redux container ------

const stateSelector = createSelector(windowWidthSelector, windowHeightSelector, (width, height) => ({
  width,
  height,
}));

const mapStateToProps = (state: RootState) => stateSelector(state);

export default connect(mapStateToProps)(Body);
