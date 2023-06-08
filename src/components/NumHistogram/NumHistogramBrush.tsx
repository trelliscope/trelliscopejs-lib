import React, { useState, MouseEvent } from 'react';
import styles from './NumHistogram.module.scss';

interface BrushState {
  isDragging: boolean;
  x: number;
  dx: number;
  startX: number;
  activeHandle: string | null;
  isMoving: boolean;
}

interface NumHistogramBrushProps {
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  selection: [number, number];
  onBrushStart: (selection: [number, number]) => void;
  onBrushEnd: (selection: [number, number]) => void;
}

const NumHistogramBrush: React.FC<NumHistogramBrushProps> = ({
  name,
  width,
  height,
  x,
  y,
  selection,
  onBrushStart,
  onBrushEnd,
}) => {
  const initialState: BrushState = {
    x: -1,
    dx: -1,
    startX: -1,
    isDragging: false,
    isMoving: false,
    activeHandle: null,
  };

  const [state, setState] = useState(initialState);
  const activeX = state.isDragging ? state.x : selection[0];
  const activeDx = state.isDragging ? state.dx : selection[1];

  const handleMouseMove = (e: MouseEvent) => {
    const { offsetX } = e.nativeEvent;
    if (state.isDragging) {
      if (state.activeHandle === 'x') {
        setState({ ...state, x: offsetX });
      } else if (state.isMoving) {
        const deltaX = offsetX - state.startX;
        const newX = offsetX - (offsetX - deltaX);
        const newDx = deltaX + (state.dx - state.x);

        if (newX < x || newDx > width) return;

        setState({ ...state, x: newX, dx: newDx });
      } else {
        setState({ ...state, dx: offsetX });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX, clientX } = e.nativeEvent;
    setState({ ...state, x: offsetX, dx: offsetX, isDragging: true, startX: clientX });
    onBrushStart([offsetX, offsetX]);
  };

  const handleMoveMouseDown = (e: React.MouseEvent) => {
    setState({
      ...state,
      x: activeX,
      dx: activeDx,
      isDragging: true,
      isMoving: true,
      startX: e.nativeEvent.offsetX - activeX,
    });
    onBrushStart([activeX, activeDx]);
  };

  const handleMouseUp = () => {
    onBrushEnd([activeX || 0, activeDx || 0]);
    setState({ ...initialState });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    setState({
      ...state,
      x: activeX,
      dx: activeDx,
      isDragging: true,
      activeHandle: handle,
      startX: e.nativeEvent.offsetX - activeX,
    });
    onBrushStart([activeX, activeDx]);
  };

  // If isDragging or isMoving use the state otherwise use the selection
  const maxX = Math.max(activeX, activeDx);
  const minX = Math.min(activeX, activeDx);
  const brushX = state.isDragging || state.isMoving ? minX : activeX || 0;
  const brushWidth = state.isDragging || state.isMoving ? maxX - minX : activeDx - activeX;

  let overlayCursor = 'crosshair';

  if (state.isMoving) {
    overlayCursor = 'move';
  } else if (state.activeHandle) {
    overlayCursor = 'ew-resize';
  }

  return (
    <g className={styles.brush} pointerEvents={state.isDragging ? 'none' : 'all'}>
      <clipPath id={`clip-${name}`}>
        <rect width={brushWidth > 0 ? brushWidth : 0} height={height} x={brushX} y={y} />
      </clipPath>
      <rect
        className={styles.brushOverlay}
        cursor={overlayCursor}
        width={width}
        height={height}
        x={x}
        y={y}
        onMouseDown={handleMouseDown}
        onMouseMove={state.isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <rect
        className={styles.brushSelection}
        width={brushWidth > 0 ? brushWidth : 0}
        height={height}
        x={brushX}
        y={y}
        pointerEvents={!state.isDragging ? 'all' : 'none'}
        onMouseDown={handleMoveMouseDown}
      />
      {activeX > -1 && activeDx > -1 && brushWidth > 0 && (
        <g className={styles.brushHandles}>
          <rect
            className={styles.brushHandle}
            height={height}
            x={activeX - 5}
            y={y}
            onMouseDown={(e) => handleResizeMouseDown(e, 'x')}
          />
          <rect
            className={styles.brushHandle}
            height={height}
            x={activeDx - 5}
            y={y}
            onMouseDown={(e) => handleResizeMouseDown(e, 'dx')}
          />
        </g>
      )}
    </g>
  );
};

export default NumHistogramBrush;
