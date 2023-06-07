import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { Value } from '@wojtekmaj/react-daterange-picker/dist/cjs/shared/types';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { updateFilter, addFilter, removeFilter } from '../../slices/filterSlice';
import NumHistogram from '../NumHistogram/NumHistogram';
import useMetaInfo from '../../selectors/useMetaInfo';
import styles from './FilterDateTimeRange.module.scss';
import { FILTER_TYPE_DATERANGE } from '../../constants';

interface FilterDateTimeRangeProps {
  meta: IMeta;
  filter: INumberRangeFilterState;
}

const FilterDateTimeRange: React.FC<FilterDateTimeRangeProps> = ({ meta, filter }) => {
  const [date, setDate] = useState<Date[]>();
  const dispatch = useDispatch();

  const { yDomain, xDomain, data } = useMetaInfo(meta.varname, meta.type);

  const minute = 60000; // we need to add a minute when setting the date picker and minus one when setting filters, for some reason the date picker is off by a day.

  useEffect(() => {
    if (filter?.min && filter?.max && filter?.min !== -Infinity && filter?.max !== Infinity) {
      setDate([new Date(filter.min), new Date(filter.max - minute)]);
      return;
    }
    if ((filter?.min && !filter?.max) || (filter?.min && filter?.max === Infinity)) {
      setDate([new Date(filter.min), undefined] as Date[]);
    }
    if ((filter?.max && !filter?.min) || (filter?.max && filter?.min === -Infinity)) {
      setDate([undefined, new Date(filter.max - minute)] as Date[]);
    }
    if ((!filter?.min && !filter?.max) || (filter?.min === -Infinity && filter?.max === Infinity)) {
      setDate([undefined, undefined] as unknown as Date[]);
    }
  }, [minute, filter?.max, filter?.min]);

  const handleOnBrush = (values: number[] | null[]) => {
    if (values[0] === null && values[1] === null) {
      if (filter) {
        dispatch(removeFilter(filter.varname));
      }
    } else if (filter) {
      dispatch(
        updateFilter({
          ...filter,
          min: values[0] ? new Date(values[0])?.getTime() : -Infinity,
          max: values[1] ? new Date(values[1])?.getTime() : Infinity,
        }),
      );
    } else {
      const newState = {
        varname: meta.varname,
        filtertype: FILTER_TYPE_DATERANGE,
        type: 'filter',
        min: values[0] ? new Date(values[0])?.getTime() : -Infinity,
        max: values[1] ? new Date(values[1])?.getTime() : Infinity,
        metatype: 'date',
      } as INumberRangeFilterState;
      dispatch(addFilter(newState));
    }
  };

  const onChange = (value: Date[]) => {
    let newState = {} as INumberRangeFilterState;
    setDate(value);

    if (filter) {
      newState = {
        ...filter,
        min: value[0] ? value[0]?.getTime() : -Infinity,
        max: value[1] ? value[1]?.getTime() + minute : Infinity,
      };
      dispatch(updateFilter(newState));
    } else {
      newState = {
        varname: meta.varname,
        filtertype: 'daterange',
        type: 'filter',
        min: value[0] ? value[0]?.getTime() : -Infinity,
        max: value[1] ? value[1]?.getTime() + minute : Infinity,
        metatype: 'date',
      };
      dispatch(addFilter(newState));
    }
  };

  return (
    <>
      <NumHistogram
        width={399}
        height={175}
        yDomain={yDomain as [number, number]}
        xDomain={xDomain as [number, number]}
        data={data as { key: string | number; value: number }[]}
        name={meta.varname}
        onBrush={handleOnBrush}
        selection={[filter?.min === -Infinity ? 0 : filter?.min || 0, filter?.max === Infinity ? 0 : filter?.max || 0]}
        log={false}
        isDate
      />
      <div className={styles.filterDateTimeRange}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DateTimeRangePicker
          onChange={(value: Value) => onChange(value as Date[])}
          value={date as unknown as Date}
          showLeadingZeros
          disableClock
        />
      </div>
    </>
  );
};

export default FilterDateTimeRange;