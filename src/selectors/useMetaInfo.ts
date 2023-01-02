import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useContext } from 'react';
import { DataContext } from '../components/DataProvider';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP } from '../constants';

const useMetaInfo = (varname: string, metaType: MetaType) => {
  const { data } = useContext(DataContext);
  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_NUMBERRANGE) {
    const range = extent(data, (d) => d[varname] as number) as [number, number];
    const scale = scaleLinear().domain(range).nice();
    const breaks = scale.ticks(10);
    const delta = breaks[1] - breaks[0];
    return { range, breaks, delta };
  }

  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_CATEGORY) {
    console.log(data);
    return 'wassup'!;
  }

  return {};
};

export default useMetaInfo;
