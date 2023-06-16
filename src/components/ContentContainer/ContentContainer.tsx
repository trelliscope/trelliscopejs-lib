import React, { useReducer, useRef } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { sidebarActiveSelector } from '../../selectors/ui';
import Content from '../Content/Content';
import ContentHeader from '../ContentHeader';
import styles from './ContentContainer.module.scss';

const ContentContainer: React.FC = () => {
  const sidebarOpen = useSelector(sidebarActiveSelector);
  // both the tableInstanceRef and the rerender are needed as a hack to get the table to rerender
  // and extract the button for the columns out of the table library
  const tableInstanceRef = useRef(null);
  const rerender = useReducer(() => ({}), {})[1] as never;
  return (
    <div className={classNames(styles.contentContainer, { [styles.contentContainer__closed]: !sidebarOpen })}>
      <ContentHeader tableRef={tableInstanceRef} rerender={rerender} />
      <Content tableRef={tableInstanceRef} rerender={rerender} />
    </div>
  );
};

export default ContentContainer;
