import classNames from 'classnames';
import React from 'react';
import styles from './NumHistogram.module.scss';

interface NumHistogramBarProps {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

const NumHistogramBar: React.FC<NumHistogramBarProps> = ({ name, x, y, width, height, active }) => (
  <>
    <rect className={classNames(styles.bar, styles.barBackground)} x={x} y={y} width={width} height={height} stroke="white" />
    <rect
      className={classNames(styles.bar, { [styles.bar__active]: active })}
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="white"
      clipPath={active ? `url(#clip-${name})` : ''}
    />
  </>
);

export default NumHistogramBar;
