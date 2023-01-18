import { extent, max, rollup } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useContext } from 'react';
import { DataContext } from '../components/DataProvider';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP } from '../constants';

const useMetaInfo = (varname: string, metaType?: MetaType) => {
  const { allData = [], groupBy } = useContext(DataContext);
  if (!metaType || !varname) return {};

  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_NUMBERRANGE) {
    const xExtents = extent(allData, (d) => d[varname] as number) as [number, number];
    const scale = scaleLinear().domain(xExtents).nice();
    const breaks = scale.ticks(10);
    const delta = breaks[1] - breaks[0];
    const data = groupBy(varname, (d: string | number) =>
      Number.isNaN(d) || d === undefined ? false : Math.floor((d as number) / delta) * delta,
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
      dist[k] = v;
    });

    const maxValue = max(Array.from(groupedData), (d) => d[1]);

    return { dist, domain: [0, maxValue] };
  }

  return {};
};

export default useMetaInfo;
