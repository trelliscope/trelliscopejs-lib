import { useContext } from 'react';
import { extent, max, rollup } from 'd3-array';
import { axisBottom } from 'd3-axis';
import { scaleLinear, scaleLog } from 'd3-scale';
import { DataContext } from '../components/DataProvider';
import { FILTER_TYPE_CATEGORY, FILTER_TYPE_NUMBERRANGE, META_FILTER_TYPE_MAP } from '../constants';
import { useDisplayInfo } from '../slices/displayInfoAPI';

const reduceArrayEvenlyWithBoundaries = (array: number[], n: number) => {
  if (n >= array.length) {
    return array; // if n is greater or equal to the length of the array, return the original array
  }
  const step = Math.floor((array.length - 2) / (n - 2)); // calculate the step size between the middle elements
  const result = [array[0]]; // add the first element to the result array
  let index = step;

  // in this situation it makes sense to have a standard for loop for simplicity and code readability
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < n - 1; i++) {
    result.push(array[index]); // push the middle elements to the result array
    index += step;
  }
  result.push(array[array.length - 1]); // add the last element to the result array
  return result;
};

const useMetaInfo = (varname: string, metaType?: MetaType) => {
  const { allData = [], groupBy } = useContext(DataContext);
  const { data: displayInfo } = useDisplayInfo();

  if (!metaType || !varname) return {};

  if (META_FILTER_TYPE_MAP[metaType] === FILTER_TYPE_NUMBERRANGE) {
    const xExtents = extent(allData, (d) => d[varname] as number) as [number, number];

    const scale = scaleLog().domain(xExtents).nice();

    const breaks = scale.ticks();
    const buckets = reduceArrayEvenlyWithBoundaries(breaks, 7);
    console.log('buckets:::::', buckets);

    // const delta = breaks[1] - breaks[0];

    // FIXME once the dataclient groupby is finished we can fix this.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore ts2554
    // const data = groupBy(varname, 'number', (d: string | number) =>
    //   Number.isNaN(Number(d)) || d === undefined ? null : Math.floor((d as number) / delta) * delta,
    // );

    const data = groupBy(varname, 'number', (d: string | number) => {
      // console.log('running');
      if (Number.isNaN(Number(d)) || d === undefined) return null;
      const value = d as number;
      const matchingBucket = buckets.reduce((prevBucket: number | null, curBucket) => {
        // If we've already found a valid bucket, and the current bucket is larger than both the previous bucket and the value,
        // then we can safely return the previous bucket as the closest minimum bucket, this reduces the number of iterations for performance
        if (prevBucket !== null && curBucket > prevBucket && curBucket > value) {
          return prevBucket;
        }
        // If the value is greater than or equal to the current bucket, then it belongs in that bucket
        if (value >= curBucket) {
          return curBucket;
        }
        // Otherwise, the current bucket is the closest minimum bucket so far
        return prevBucket === null ? null : curBucket;
      }, null); // Set the initial value to null to handle values less than the smallest bucket and stop iteration for performance
      return matchingBucket;
    });

    console.log('bucketedData:::::', data);

    const yDomain = extent(data, (d) => d.value as number) as [number, number];

    return { yDomain, xDomain: buckets, data };
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

    return { dist, domain: [0, maxValue] as [number, number] };
  }

  return {};
};

export default useMetaInfo;
