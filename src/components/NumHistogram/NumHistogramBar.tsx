import React from 'react';
import { useTheme } from '@mui/material/styles';

interface NumHistogramBarProps {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

const NumHistogramBar: React.FC<NumHistogramBarProps> = ({ name, x, y, width, height, active }) => {
  const theme = useTheme();
  return (
    <>
      <rect
        style={{
          fill: theme.palette.secondary.dark,
          strokeWidth: '1px',
        }}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="white"
      />
      <rect
        style={{
          fill: theme.palette.secondary.contrastText,
          strokeWidth: '1px',
        }}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="white"
        clipPath={active ? `url(#clip-${name})` : ''}
      />
    </>
  );
};

export default NumHistogramBar;
