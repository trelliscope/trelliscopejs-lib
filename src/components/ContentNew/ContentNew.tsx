import React, { useReducer, useRef } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { sidebarActiveSelector } from '../../selectors/ui';
import Content from '../Content/Content';
import ContentHeader from '../ContentHeader';
import styles from './ContentNew.module.scss';

const ContentNew: React.FC = () => {
  const sidebarOpen = useSelector(sidebarActiveSelector);
  // both the tableInstanceRef and the rerender are needed as a hack to get the table to rerender
  // and extract the button for the columns out of the table library
  const tableInstanceRef = useRef(null);
  const rerender = useReducer(() => ({}), {})[1] as never;
  return (
    <div className={classNames(styles.contentNew, { [styles.contentNew__closed]: !sidebarOpen })}>
      <ContentHeader tableRef={tableInstanceRef} rerender={rerender} />
      <Content tableRef={tableInstanceRef} rerender={rerender} />
    </div>
  );
};

export default ContentNew;
