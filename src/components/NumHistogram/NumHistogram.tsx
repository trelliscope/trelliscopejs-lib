import React, { useRef, useState } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import classNames from 'classnames';
import type { MouseEvent } from 'react';
import styles from './NumHistogram.module.scss';

interface NumHistogramProps {
  width: number;
  height: number;
  yDomain: [number, number];
  xDomain: number[];
  data: { key: string; value: number }[];
  name: string;
  onBrush: ([number1, number2]: number[]) => void;
  defaultBrushValues: [number, number];
}

interface BrushState {
  isDragging: boolean;
  x: number | null;
  dx: number | null;
  activeHandle: string;
  isMoving: boolean;
  startX: number | null;
}

const NumHistogram: React.FC<NumHistogramProps> = ({
  width,
  height,
  yDomain,
  xDomain = [0, 1],
  data,
  name,
  onBrush,
  defaultBrushValues,
}) => {
  const brushRef = useRef(null);
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

  const [brushState, setBrushState] = useState<BrushState>({
    isDragging: false,
    x: defaultBrushValues[0] || defaultBrushValues[1] ? valueScale(Math.max(defaultBrushValues[0], xExtents[0])) : null,
    dx: defaultBrushValues[0] || defaultBrushValues[1] ? valueScale(Math.min(defaultBrushValues[1], xExtents[1])) : null,
    activeHandle: '',
    isMoving: false,
    startX: 0,
  });

  const handleMouseDown = (e: MouseEvent) => {
    setBrushState({
      ...brushState,
      x: e.nativeEvent.offsetX - xPad,
      dx: e.nativeEvent.offsetX - xPad,
      isDragging: true,
      startX: e.nativeEvent.offsetX,
    });
  };

  const handleMouseUp = () => {
    if (brushState.x === brushState.dx) {
      setBrushState({ isDragging: false, x: null, dx: null, activeHandle: '' });
    } else {
      const x = invert(brushState.x - 1);
      const dx = invert(brushState.dx - 1);
      onBrush([Math.min(x, dx), Math.max(x, dx)]);
      setBrushState({
        ...brushState,
        isDragging: false,
        x: Math.min(brushState.dx, brushState.x),
        dx: Math.max(brushState.dx, brushState.x),
        activeHandle: '',
        isMoving: false,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (brushState.isDragging) {
      if (brushState.activeHandle === 'x') {
        setBrushState({ ...brushState, x: e.nativeEvent.offsetX - xPad });
      } else if (brushState.isMoving) {
        const deltaX = e.nativeEvent.offsetX - brushState.startX;
        const x = e.nativeEvent.offsetX - (e.nativeEvent.offsetX - deltaX);
        const dx = deltaX + (brushState.dx - brushState.x);

        if (x < 0 || dx > width - xPad) return;

        setBrushState({ ...brushState, x, dx });
      } else {
        setBrushState({ ...brushState, dx: e.nativeEvent.offsetX - xPad });
      }
    }
  };

  const handleResizeMouseDown = (e: MouseEvent, handle: string) => {
    setBrushState({ ...brushState, isDragging: true, activeHandle: handle, startX: e.nativeEvent.offsetX - brushState.x });
  };

  const handleMoveMouseDown = (e: MouseEvent) => {
    setBrushState({ ...brushState, isDragging: true, isMoving: true, startX: e.nativeEvent.offsetX - brushState.x });
  };

  return (
    <svg width={width} height={height} className={styles.numHistogram}>
      <clipPath id={`clip-${name}`}>
        <rect
          id="cliprect"
          x={brushState.x !== null && brushState.dx !== null ? Math.min(brushState.x, brushState.dx) : 0}
          width={
            brushState.x !== null && brushState.dx !== null
              ? Math.max(brushState.x, brushState.dx) - Math.min(brushState.x, brushState.dx)
              : 0
          }
          height={height - axisPad}
        />
      </clipPath>
      <g>
        {data.map((d) => (
          <>
            <rect
              className={classNames(styles.bar, styles.barBackground)}
              key={`background${d.key}`}
              width={xScale.bandwidth()}
              height={yScale(d.value)}
              x={xScale(d.key) + 1}
              y={height - yScale(d.value) - axisPad - 1}
              shapeRendering="crispEdges"
            />
            <rect
              className={classNames(styles.bar, {
                [styles.bar__active]:
                  (!brushState.isDragging && brushState.dx) || brushState.isMoving || brushState.activeHandle,
              })}
              key={d.key}
              width={xScale.bandwidth()}
              height={yScale(d.value)}
              x={xScale(d.key) + 1}
              y={height - yScale(d.value) - axisPad - 1}
              shapeRendering="crispEdges"
              clipPath={!brushState.isDragging && !brushState.dx ? '' : `url(#clip-${name})`}
            />
          </>
        ))}
      </g>
      <g transform={`translate(0, ${height - axisPad})`} fontSize="10">
        <line
          x1={xScale(xDomain[0])}
          y="0"
          x2={width - xPad}
          stroke="black"
          strokeWidth="1"
          shapeRendering="crispEdges"
          opacity="0.4"
        />
        <g transform={`translate(${xScale(xDomain[0])}, 0)`} opacity="0.4">
          <line y1={4} y2={0} stroke="black" shapeRendering="crispEdges" />
        </g>
        {ticks.map((d) => (
          <g key={d} transform={`translate(${xScale(d)}, 0)`} opacity="0.4">
            <line y1={4} y2={0} stroke="black" shapeRendering="crispEdges" />
            <text y={axisPad} textAnchor="middle" shapeRendering="crispEdges">
              {d}
            </text>
          </g>
        ))}
        <g transform={`translate(${width - xPad}, 0)`} opacity="0.4">
          <line y1={4} y2={0} stroke="black" shapeRendering="crispEdges" />
        </g>
      </g>
      <g className={styles.brush} pointerEvents={brushState.isDragging ? 'none' : 'all'} fill="none">
        <rect
          className={styles.brushOverlay}
          key="brushOverlay"
          ref={brushRef}
          pointerEvents="all"
          cursor={brushState.isMoving ? 'move' : 'crosshair'}
          width={width - xPad}
          height={height - axisPad}
          x={0.5}
          y={1}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        <rect
          className={styles.brushSelection}
          key="brushSelection"
          cursor="move"
          fillOpacity="0.125"
          stroke="rgb(255, 170, 10)"
          shapeRendering="crispEdges"
          strokeOpacity="0.2"
          x={Math.min(brushState.x, brushState.dx)}
          width={Math.max(brushState.x, brushState.dx) - Math.min(brushState.x, brushState.dx)}
          height={height - axisPad}
          pointerEvents={brushState.x !== null && brushState.dx !== null && !brushState.isDragging ? 'all' : 'none'}
          onMouseDown={handleMoveMouseDown}
        />
        {brushState.x !== null && brushState.dx !== null && !brushState.isDragging && (
          <>
            <rect
              className={classNames(styles.brushHandle, styles.brushHandleLeft)}
              key="brushHandleLeft"
              cursor="ew-resize"
              x={brushState.x - 3}
              y={1}
              height={height - axisPad}
              width={6}
              onMouseDown={(e) => handleResizeMouseDown(e, 'x')}
            />
            <rect
              className={classNames(styles.brushHandle, styles.brushHandleRight)}
              key="brushHandleRight"
              cursor="ew-resize"
              x={brushState.dx - 3}
              y={1}
              height={height - axisPad}
              width={6}
              onMouseDown={(e) => handleResizeMouseDown(e, 'dx')}
            />
          </>
        )}
      </g>
    </svg>
  );
};

export default NumHistogram;
