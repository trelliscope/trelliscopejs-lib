import { extent, rollup } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useContext } from 'react';
import { DataContext } from '../components/DataProvider';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP } from '../constants';

const useMetaInfo = (varname: string, metaType?: MetaType) => {
  const { allData = [] } = useContext(DataContext);

  if (!metaType || !varname) return {};

  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_NUMBERRANGE) {
    const range = extent(allData, (d) => d[varname] as number) as [number, number];
    const scale = scaleLinear().domain(range).nice();
    const breaks = scale.ticks(10);
    const delta = breaks[1] - breaks[0];
    return { range, breaks, delta };
  }

  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_CATEGORY) {
    const dist = Array.from(
      rollup(
        allData,
        (v) => v.length,
        (d) => d[varname],
      ),
    ).map((d) => ({ key: d[0], value: d[1] }));
    console.log(dist);

    const range = extent(dist, (d) => d.value) as [number, number];
    console.log(range);

    const scale = scaleLinear().domain(range);
    console.log(scale.ticks());

    // const scale = scaleLinear().domain(range).nice();
    return 'wassup'!;
  }

  return {};
};

export default useMetaInfo;
