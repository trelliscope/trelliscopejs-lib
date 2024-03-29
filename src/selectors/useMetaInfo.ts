import { extent, max, rollup } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useContext } from 'react';
import { DataContext } from '../components/DataProvider';
import {
  FILTER_TYPE_CATEGORY,
  FILTER_TYPE_DATERANGE,
  FILTER_TYPE_DATETIMERANGE,
  FILTER_TYPE_NUMBERRANGE,
  META_FILTER_TYPE_MAP,
  MISSING_TEXT,
} from '../constants';
import { useDisplayMetas } from '../slices/displayInfoAPI';

const useMetaInfo = (varname: string, metaType?: MetaType) => {
  const { allData = [], groupBy } = useContext(DataContext);
  const metas = useDisplayMetas();
  const metaObj = metas.find((meta) => meta.varname === varname);
  const { log } = metaObj as IMeta;
  if (!metaType || !varname) return {};

  if (
    META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_NUMBERRANGE ||
    META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATERANGE ||
    META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATETIMERANGE
  ) {
    const xExtents = extent(allData, (d) => {
      if (log) {
        return Math.log10(d[varname] as number);
      }
      if (
        META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATERANGE ||
        META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATETIMERANGE
      ) {
        return new Date(d[varname]).getTime() as number;
      }
      return d[varname] as number;
    }) as [number, number];

    const scale = scaleLinear().domain(xExtents).nice();
    const breaks = scale.ticks(10);
    // FIXME once the dataclient groupby is finished we can fix this.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore ts2554
    const data = groupBy(
      varname,
      META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATERANGE
        ? 'date'
        : META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATETIMERANGE
        ? 'datetime'
        : 'number',
      (d: number) => {
        if (Number.isNaN(Number(d)) || d === undefined) return null;

        if (log && Math.log10(d) >= breaks[breaks.length - 1]) return breaks[breaks.length - 1];

        if (
          META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATERANGE ||
          META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATETIMERANGE
        )
          return breaks.find((b, i) => new Date(d).getTime() < breaks[i + 1]);

        if (
          (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATERANGE ||
            META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_DATETIMERANGE) &&
          new Date(d).getTime() >= breaks[breaks.length - 1] &&
          !log
        )
          return breaks[breaks.length - 1];

        if (d >= breaks[breaks.length - 1] && !log) return breaks[breaks.length - 1];
        return breaks.find((b, i) => (log ? Math.log10(d) < breaks[i + 1] : d < breaks[i + 1]));
      },
    );

    const yDomain = extent(data, (d) => d.value as number) as [number, number];

    return { yDomain, xDomain: breaks, data };
  }

  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_CATEGORY) {
    const dist: { [key: string]: number } = {};
    const groupedData = rollup(
      allData,
      (v) => v.length,
      (d) => d[varname],
    );

    groupedData.forEach((v, k) => {
      dist[k === undefined ? MISSING_TEXT : k] = v;
    });

    const maxValue = max(Array.from(groupedData), (d) => d[1]);

    return { dist, domain: [0, maxValue] as [number, number] };
  }

  return {};
};

export default useMetaInfo;
