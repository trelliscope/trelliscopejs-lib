import React from 'react';
import classNames from 'classnames';
import { getLabelFromFactor } from '../../utils';

import styles from './CatHistogram.module.scss';
import { MISSING_TEXT, META_TYPE_FACTOR } from '../../constants';

interface CatHistogramBarProps {
  width: number;
  height: number;
  label: string;
  value: string | number;
  active: boolean;
  style: object;
  onClick: (key: string) => void;
  metaLevels: string[];
  metaType: string;
}

const CatHistogramBar: React.FC<CatHistogramBarProps> = ({
  active,
  style,
  onClick,
  width,
  height,
  label,
  value,
  metaLevels,
  metaType,
}) => {
  const handleClick = () => {
    if (label === MISSING_TEXT && metaType === META_TYPE_FACTOR) {
      return onClick(-Infinity as unknown as string);
    }
    return onClick(label);
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
        <div className={styles.catHistogramBarLabel}>
          {label === MISSING_TEXT
            ? MISSING_TEXT
            : !metaLevels
            ? label
            : getLabelFromFactor(label as unknown as number, metaLevels)}
        </div>
      </div>
      <div className={styles.catHistogramBarValue}>{value}</div>
      {active && (
        <div className={styles.catHistogramBarIndicator} />
      )}
    </div>
  );
};

export default CatHistogramBar;
