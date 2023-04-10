import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { sidebarActiveSelector } from '../../selectors/ui';
import Content from '../Content/Content';
import ContentHeader from '../ContentHeader';
import styles from './ContentNew.module.scss';

const ContentNew: React.FC = () => {
  const sidebarOpen = useSelector(sidebarActiveSelector);
  return (
    <div className={classNames(styles.contentNew, { [styles.contentNew__closed]: !sidebarOpen })}>
      <ContentHeader />
      <Content />
    </div>
  );
};

export default ContentNew;
