import classNames from 'classnames';
import { scaleLinear } from 'd3-scale';
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import styles from './CatHistogram.module.scss';

interface CatHistogramProps {
  data: { key: string; value: number }[];
  domain: [number, number];
  count: number;
  actives: string[];
  width: number;
  height: number;
}

const CatHistogram: React.FC<CatHistogramProps> = ({
  data = [],
  domain,
  count = 0,
  actives = [],
  width = 220,
  height = 125,
}) => {
  if (data.length === 0) return null;

  const scale = scaleLinear().domain(domain).range([0, width]);

  return (
    <div className={styles.catHistogram}>
      <List height={height} width={width} itemSize={15} itemCount={count}>
        {({ index, style }) => {
          console.log(data[index], domain);

          return (
            <div
              className={classNames(styles.catHistogramBarWrapper, {
                [styles.catHistogramBarWrapper__active]: actives.includes(data[index].key),
              })}
              style={style}
            >
              <div className={styles.catHistogramBar} style={{ width: scale(data[index].value), height: 15 }} />
            </div>
          );
        }}
      </List>
    </div>
  );
};

export default CatHistogram;
