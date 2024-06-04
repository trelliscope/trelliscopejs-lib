import type { ScaleLinear } from 'd3-scale';
import React from 'react';
import { useTheme } from '@mui/material/styles';
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
  isDate: boolean;
}

const NumHistogramAxis: React.FC<NumHistogramAxisProps> = ({ width, height, x, y, ticks, scale, log, isDate }) => {
  const theme = useTheme();
  const tickStyles = {
    stroke: theme.palette.text.primary,
    strokeWidth: '1px',
  };

  return (
    <g className={styles.axis} transform={`translate(0, ${y})`}>
      <line style={tickStyles} x1={x} y="0" x2={width} />
      <g transform={`translate(${x}, 0)`}>
        <line style={tickStyles} y1={4} y2={0} />
      </g>
      {ticks.map((d) => (
        <g className={styles.axisTick} key={d} transform={`translate(${scale(d) || 0}, 0)`}>
          <line style={tickStyles} y1={4} y2={0} x1={x} x2={x} />
          {log && (
            <text
              style={{ fill: theme.palette.text.primary }}
              y={height}
              x={x}
              className={styles.axisTickSuper}
              transform="translate(3,0)"
            >
              10
              <tspan baselineShift="super">
                <FormattedNumber value={d} maximumFractionDigits={2} isSuffix />
              </tspan>
            </text>
          )}
          {isDate && (
            <text style={{ fill: theme.palette.text.primary }} className={styles.axisTickText} y={height} x={x}>
              {new Date(d).toLocaleDateString()}
            </text>
          )}
          {!log && !isDate && (
            <text style={{ fill: theme.palette.text.primary }} className={styles.axisTickText} y={height} x={x}>
              <FormattedNumber value={d} maximumFractionDigits={2} isSuffix />
            </text>
          )}
        </g>
      ))}
      <g style={tickStyles} transform={`translate(${width}, 0)`}>
        <line y1={4} y2={0} />
      </g>
    </g>
  );
};

export default NumHistogramAxis;
