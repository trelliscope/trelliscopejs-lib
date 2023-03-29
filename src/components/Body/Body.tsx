import React from 'react';
import { useSelector } from 'react-redux';
import { windowWidthSelector, windowHeightSelector } from '../../selectors/ui';
import SideButtons from '../SideButtons';
import Sidebar from '../Sidebar';
import styles from './Body.module.scss';
import Content from '../Content';

const Body: React.FC = () => {
  const width = useSelector(windowWidthSelector);
  const height = useSelector(windowHeightSelector);
  return (
    <div className={styles.body} style={{ width, height }}>
      <SideButtons />
      <Sidebar />
      <Content />
    </div>
  );
};

export default Body;
