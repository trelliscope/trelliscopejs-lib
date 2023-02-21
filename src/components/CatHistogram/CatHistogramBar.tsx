import React from 'react';
import classNames from 'classnames';

import styles from './CatHistogram.module.scss';

interface CatHistogramBarProps {
  width: number;
  height: number;
  label: string;
  value: string | number;
  active: boolean;
  style: object;
  onClick: (key: string) => void;
}

const CatHistogramBar: React.FC<CatHistogramBarProps> = ({ active, style, onClick, width, height, label, value }) => {
  const handleClick = () => {
    onClick(label);
  };

  return (
    <div
      className={classNames(styles.catHistogramBarWrapper, {
        [styles.catHistogramBarWrapper__active]: active,
      })}
      style={style}
      role="presentation"
      onClick={handleClick}
    >
      <div className={styles.catHistogramBar} style={{ width, height }}>
        <div className={styles.catHistogramBarLabel}>{label}</div>
      </div>
      <div className={styles.catHistogramBarValue}>{value}</div>
    </div>
  );
};

export default CatHistogramBar;
