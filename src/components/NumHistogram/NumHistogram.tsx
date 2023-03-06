import React, { useState } from 'react';
import { scaleLinear } from 'd3-scale';
import styles from './NumHistogram.module.scss';
import NumHistogramBrush from './NumHistogramBrush';
import NumHistogramAxis from './NumHistogramAxis';
import NumHistogramBar from './NumHistogramBar';

interface NumHistogramProps {
  width: number;
  height: number;
  yDomain: [number, number];
  xDomain: number[];
  data: { key: number | string; value: number }[];
  name: string;
  onBrush: ([number1, number2]: number[] | null[]) => void;
  selection: [number, number];
}

const NumHistogram: React.FC<NumHistogramProps> = ({
  width,
  height,
  yDomain,
  xDomain = [0, 1],
  data,
  name,
  onBrush,
  selection,
}) => {
  const axisPad = 16;
  const xPad = 5;
  const innerWidth = width - xPad;
  const barWidth = innerWidth / xDomain.length - Math.max((innerWidth * 0.12) / xDomain.length, 2);
  const delta = xDomain[1] - xDomain[0];
  const xExtents = [xDomain[0], xDomain[xDomain.length - 1] + delta];

  const xScale = scaleLinear()
    .domain(xExtents)
    .range([0, innerWidth - xPad]);
  const ticks = xScale.ticks(5);

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([0, height - axisPad]);

  const { invert } = xScale;

  const [brushActive, setBrushActive] = useState(false);

  const handleBrushStart = () => {
    setBrushActive(true);
  };

  const handleBrushEnd = ([x, dx]: number[]) => {
    if (brushActive) {
      if (x === dx) {
        onBrush([null, null]);
      } else {
        const x1 = invert(x);
        const dx1 = invert(dx);
        onBrush([Math.min(x1, dx1), Math.max(x1, dx1)]);
      }
      setBrushActive(false);
    }
  };

  return (
    <svg width={width} height={height} className={styles.numHistogram}>
      <g>
        {data.map((d) => (
          <NumHistogramBar
            name={name}
            key={`${name}-${d.key}-${d.value}`}
            width={barWidth}
            height={yScale(d.value)}
            x={(xScale(d.key as number) || 0) + xPad}
            y={height - yScale(d.value) - axisPad - 1}
            active={brushActive || selection[0] !== selection[1]}
          />
        ))}
      </g>
      <NumHistogramAxis
        width={innerWidth}
        height={axisPad}
        x={(xScale(xDomain[0]) || 0) + xPad}
        y={height - axisPad}
        ticks={ticks}
        scale={xScale}
      />
      <NumHistogramBrush
        name={name}
        selection={[
          selection[0] === 0 ? 0 : xScale(selection[0]),
          selection[1] === 0 ? (selection[0] === 0 ? 0 : innerWidth) : xScale(selection[1]),
        ]}
        width={innerWidth}
        height={height - axisPad}
        x={xPad / 2}
        y={1}
        onBrushStart={handleBrushStart}
        onBrushEnd={handleBrushEnd}
      />
    </svg>
  );
};

export default NumHistogram;
