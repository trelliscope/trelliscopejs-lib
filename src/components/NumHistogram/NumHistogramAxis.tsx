import type { ScaleLinear } from 'd3-scale';
import React from 'react';
import FormattedNumber from '../FormattedNumber';
import styles from './NumHistogram.module.scss';

interface NumHistogramAxisProps {
  width: number;
  height: number;
  x: number;
  y: number;
  ticks: number[];
  scale: ScaleLinear<number, number>;
  log: boolean;
}

const NumHistogramAxis: React.FC<NumHistogramAxisProps> = ({ width, height, x, y, ticks, scale, log }) => (
  <g className={styles.axis} transform={`translate(0, ${y})`}>
    <line className={styles.axisXLine} x1={x} y="0" x2={width} />
    <g className={styles.axisEdgeTick} transform={`translate(${x}, 0)`}>
      <line y1={4} y2={0} />
    </g>
    {ticks.map((d) => (
      <g className={styles.axisTick} key={d} transform={`translate(${scale(d) || 0}, 0)`}>
        <line y1={4} y2={0} x1={x} x2={x} />
        {log ? (
          <text y={height} x={x} className={styles.axisTickSuper} transform="translate(3,0)">
            10
            <tspan baselineShift="super">
              <FormattedNumber value={d} maximumFractionDigits={2} isSuffix />
            </tspan>
          </text>
        ) : (
          <text y={height} x={x}>
            <FormattedNumber value={d} maximumFractionDigits={2} isSuffix />
          </text>
        )}
      </g>
    ))}
    <g className={styles.axisEdgeTick} transform={`translate(${width}, 0)`}>
      <line y1={4} y2={0} />
    </g>
  </g>
);

export default NumHistogramAxis;
