import React from 'react';
import styles from './NumHistogram.module.scss';

interface NumHistogramAxisProps {
  width: number;
  height: number;
  x: number;
  y: number;
  ticks: number[];
  scale: (x: number) => number;
}

const NumHistogramAxis: React.FC<NumHistogramAxisProps> = ({ width, height, x, y, ticks, scale }) => (
  <g className={styles.axis} transform={`translate(0, ${y})`}>
    <line className={styles.axisXLine} x1={x} y="0" x2={width} />
    <g className={styles.axisEdgeTick} transform={`translate(${x}, 0)`}>
      <line y1={4} y2={0} />
    </g>
    {ticks.map((d) => (
      <g className={styles.axisTick} key={d} transform={`translate(${scale(d)}, 0)`}>
        <line y1={4} y2={0} />
        <text y={height}>{d}</text>
      </g>
    ))}
    <g className={styles.axisEdgeTick} transform={`translate(${width}, 0)`}>
      <line y1={4} y2={0} />
    </g>
  </g>
);

export default NumHistogramAxis;
