import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { Value } from '@wojtekmaj/react-daterange-picker/dist/cjs/shared/types';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { updateFilter, addFilter, removeFilter } from '../../slices/filterSlice';
import NumHistogram from '../NumHistogram/NumHistogram';
import styles from './FilterDateRange.module.scss';
import useMetaInfo from '../../selectors/useMetaInfo';
import { FILTER_TYPE_DATERANGE } from '../../constants';

interface FilterDateRangeProps {
  meta: IMeta;
  filter: INumberRangeFilterState;
}

const FilterDateRange: React.FC<FilterDateRangeProps> = ({ meta, filter }) => {
  const [date, setDate] = useState<Date[]>();
  const dispatch = useDispatch();

  const { yDomain, xDomain, data } = useMetaInfo(meta.varname, meta.type);

  useEffect(() => {
    if (filter?.min && filter?.max && filter?.min !== -Infinity && filter?.max !== Infinity) {
      setDate([new Date(filter.min), new Date(filter.max)]);
      return;
    }
    if ((filter?.min && !filter?.max) || (filter?.min && filter?.max === Infinity)) {
      setDate([new Date(filter.min), undefined] as Date[]);
    }
    if ((filter?.max && !filter?.min) || (filter?.max && filter?.min === -Infinity)) {
      setDate([undefined, new Date(filter.max)] as Date[]);
    }
    if ((!filter?.min && !filter?.max) || (filter?.min === -Infinity && filter?.max === Infinity)) {
      setDate([undefined, undefined] as unknown as Date[]);
      dispatch(removeFilter(meta?.varname));
    }
  }, [dispatch, filter?.max, filter?.min, meta?.varname]);

  const handleOnBrush = (values: number[] | null[]) => {
    if (values[0] === null && values[1] === null) {
      if (filter) {
        dispatch(removeFilter(filter.varname));
      }
    } else if (filter) {
      dispatch(
        updateFilter({
          ...filter,
          min: values[0] ? new Date(values[0])?.getTime() : null,
          max: values[1] ? new Date(values[1])?.getTime() : null,
        }),
      );
    } else {
      const newState = {
        varname: meta.varname,
        filtertype: FILTER_TYPE_DATERANGE,
        type: 'filter',
        min: values[0] ? new Date(values[0])?.getTime() : null,
        max: values[1] ? new Date(values[1])?.getTime() : null,
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
        min: value[0] ? value[0]?.getTime() : null,
        max: value[1] ? value[1]?.getTime() : null,
      };
      dispatch(updateFilter(newState));
    } else {
      newState = {
        varname: meta.varname,
        filtertype: FILTER_TYPE_DATERANGE as FilterType,
        type: 'filter',
        min: value[0] ? value[0]?.getTime() : null,
        max: value[1] ? value[1]?.getTime() : null,
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
        selection={[filter?.min ?? -Infinity, filter?.max ?? Infinity]}
        log={false}
        isDate
      />
      <div className={styles.filterDateRange}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <DateRangePicker onChange={(value: Value) => onChange(value as Date[])} value={date} showLeadingZeros />
      </div>
    </>
  );
};

export default FilterDateRange;
