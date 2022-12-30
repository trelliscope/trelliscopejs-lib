import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { useContext } from 'react';
import { DataContext } from '../components/DataProvider';

const useMetaInfo = (varname: string, metaType: MetaType) => {
  const { data } = useContext(DataContext);
  if (metaType === 'number') {
    const range = extent(data, (d) => d[varname] as number) as [number, number];
    const scale = scaleLinear().domain(range).nice();
    const breaks = scale.ticks(10);
    const delta = breaks[1] - breaks[0];
    return { range, breaks, delta };
  }

  return {};
};

export default useMetaInfo;
