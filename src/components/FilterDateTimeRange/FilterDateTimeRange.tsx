import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import { Value } from '@wojtekmaj/react-daterange-picker/dist/cjs/shared/types';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import styles from './FilterDateTimeRange.module.scss';
import { updateFilter, addFilter } from '../../slices/filterSlice';

interface FilterDateTimeRangeProps {
  meta: IMeta;
  filter: INumberRangeFilterState;
}

const FilterDateTimeRange: React.FC<FilterDateTimeRangeProps> = ({ meta, filter }) => {
  const [date, setDate] = useState<Date[]>();
  const dispatch = useDispatch();

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
    if (!filter?.min && !filter?.max) {
      setDate([]);
    }
  }, [minute, filter?.max, filter?.min]);

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
  );
};

export default FilterDateTimeRange;
