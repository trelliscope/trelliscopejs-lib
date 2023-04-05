import React from 'react';
import Content from '../Content/Content';
import ContentHeader from '../ContentHeader';
import styles from './ContentNew.module.scss';

const ContentNew: React.FC = () => (
  <div className={styles.contentNew}>
    <ContentHeader />
    <Content />
  </div>
);

export default ContentNew;
