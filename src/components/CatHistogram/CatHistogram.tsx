import React from 'react';
import { scaleLinear } from 'd3-scale';
import { FixedSizeList as List } from 'react-window';
import styles from './CatHistogram.module.scss';
import CatHistogramBar from './CatHistogramBar';

interface CatHistogramProps {
  data: { key: string | number; value: number }[];
  allData: { [key: string]: number };
  domain: [number, number];
  count: number;
  actives: string[];
  width: number;
  height: number;
  barHeight: number;
  onClick: (value: string) => void;
}

const CatHistogram: React.FC<CatHistogramProps> = ({
  data = [],
  allData = {},
  domain,
  count = 0,
  actives = [],
  width = 220,
  height = 125,
  barHeight = 15,
  onClick,
}) => {
  if (data.length === 0) return null;
  const scale = scaleLinear().domain(domain).range([0, width]);

  // move active bars to the top
  data.sort((a, b) => {
    if (actives.includes(a.key as string) && !actives.includes(b.key as string)) return -1;
    if (!actives.includes(a.key as string) && actives.includes(b.key as string)) return 1;
    return 0;
  });

  return (
    <div className={styles.catHistogram}>
      <List height={height} width={width} itemSize={barHeight} itemCount={count}>
        {({ index, style }) => (
          <CatHistogramBar
            style={style}
            active={actives.includes(data[index].key as string)}
            onClick={onClick}
            width={scale(data[index].value || 1)}
            height={barHeight - 1}
            label={data[index].key as string}
            value={
              data[index].value === allData[data[index].key]
                ? data[index].value
                : `${data[index].value} / ${allData[data[index].key] || 0}`
            }
          />
        )}
      </List>
    </div>
  );
};

export default CatHistogram;
