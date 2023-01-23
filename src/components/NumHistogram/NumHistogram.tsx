import React, { useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import styles from './NumHistogram.module.scss';
import NumHistogramBrush from './NumHistogramBrush';
import NumHistogramAxis from './NumHistogramAxis';
import NumHistogramBar from './NumHistogramBar';

interface NumHistogramProps {
  width: number;
  height: number;
  yDomain: [number, number];
  xDomain: number[];
  data: { key: string; value: number }[];
  name: string;
  onBrush: ([number1, number2]: number[]) => void;
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
  const delta = xDomain[1] - xDomain[0];
  const xExtents = [xDomain[0], xDomain[xDomain.length - 1] + delta];
  const xScale = scaleBand()
    .domain(xDomain)
    .range([0, width - xPad])
    .paddingInner(0.05)
    .paddingOuter(0.05);
  const yScale = scaleLinear()
    .domain(yDomain)
    .range([0, height - axisPad]);
  const ticksScale = scaleLinear()
    .domain(xDomain)
    .range([0, width - xPad]);
  const ticks = ticksScale.ticks(5);
  const valueScale = scaleLinear()
    .domain(xExtents)
    .range([0, width - xPad]);

  const { invert } = valueScale;

  const [brushActive, setBrushActive] = useState(false);

  const handleBrushStart = () => {
    setBrushActive(true);
  };

  const handleBrushEnd = ([x, dx]: number[]) => {
    const x1 = invert(x);
    const dx1 = invert(dx);
    onBrush([Math.min(x1, dx1), Math.max(x1, dx1)]);
    setBrushActive(false);
  };

  return (
    <svg width={width} height={height} className={styles.numHistogram}>
      <g>
        {data.map((d) => (
          <NumHistogramBar
            name={name}
            width={xScale.bandwidth()}
            height={yScale(d.value)}
            x={xScale(d.key) + 1}
            y={height - yScale(d.value) - axisPad - 1}
            active={brushActive || selection[0] !== selection[1]}
          />
        ))}
      </g>
      <NumHistogramAxis
        width={width - xPad}
        height={axisPad}
        x={xScale(xDomain[0])}
        y={height - axisPad}
        ticks={ticks}
        scale={xScale}
      />
      <NumHistogramBrush
        name={name}
        selection={[valueScale(selection[0]), valueScale(selection[1])]}
        width={width - xPad}
        height={height - axisPad}
        x={0.5}
        y={1}
        onBrushStart={handleBrushStart}
        onBrushEnd={handleBrushEnd}
      />
    </svg>
  );
};

export default NumHistogram;
