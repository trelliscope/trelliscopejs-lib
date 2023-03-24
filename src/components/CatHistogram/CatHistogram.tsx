import React from 'react';
import { scaleLinear } from 'd3-scale';
import { FixedSizeList as List } from 'react-window';
import CatHistogramBar from './CatHistogramBar';
import { MISSING_TEXT, META_TYPE_FACTOR } from '../../constants';
import styles from './CatHistogram.module.scss';

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
  metaLevels: string[];
  metaType: string;
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
  metaLevels,
  metaType,
}) => {
  if (data.length === 0) return null;
  let dataFiltered = [...data];
  if (metaType === META_TYPE_FACTOR) {
    // replace all keys in data with 'NA' if they are -Infinity
    dataFiltered = data.map((d) => {
      if (d.key === -Infinity) {
        return { key: MISSING_TEXT, value: d.value };
      }
      return d;
    });
  }
  const scale = scaleLinear().domain(domain).range([0, width]);

  // move active bars to the top
  dataFiltered.sort((a, b) => {
    if (
      actives.includes((a.key === MISSING_TEXT ? -Infinity : a.key) as string) &&
      !actives.includes((b.key === MISSING_TEXT ? -Infinity : b.key) as string)
    )
      return -1;
    if (
      !actives.includes((a.key === MISSING_TEXT ? -Infinity : a.key) as string) &&
      actives.includes((b.key === MISSING_TEXT ? -Infinity : b.key) as string)
    )
      return 1;
    return 0;
  });

  return (
    <div className={styles.catHistogram}>
      <List height={height} width={width} itemSize={barHeight} itemCount={count}>
        {({ index, style }) => (
          <CatHistogramBar
            style={style}
            active={actives.includes(
              (dataFiltered[index].key === MISSING_TEXT ? -Infinity : dataFiltered[index].key) as string,
            )}
            onClick={onClick}
            width={scale(dataFiltered[index].value || 1)}
            height={barHeight - 1}
            label={dataFiltered[index].key as string}
            metaLevels={metaLevels}
            value={
              dataFiltered[index].value === allData[dataFiltered[index].key]
                ? dataFiltered[index].value
                : `${dataFiltered[index].value} / ${allData[dataFiltered[index].key] || 0}`
            }
          />
        )}
      </List>
    </div>
  );
};

export default CatHistogram;
