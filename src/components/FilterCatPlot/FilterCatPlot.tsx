import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid, GridCellProps } from 'react-virtualized';
import { filterCardinalitySelector } from '../../selectors/cogData';
import CatBar from '../FilterCatPlotBar';
import { RootState } from '../../store';
import styles from './FilterCatPlot.module.scss';

interface FilterCatPlotProps {
  height: number;
  width: number;
  cellHeight: number;
  dist: FilterCatDist;
  condDist: CondDistFilterCat;
  filterState: FilterCat;
  sortOrder: string;
  handleChange: (state: FilterCat) => void;
  filterCardinality: number;
}

const FilterCatPlot: React.FC<FilterCatPlotProps> = ({
  height,
  width,
  cellHeight,
  dist,
  condDist,
  filterState,
  sortOrder,
  handleChange,
  filterCardinality,
}) => {
  const handleSelect = (val: string, active: boolean) => {
    const selectArr = Object.assign([], filterState.value) as string[];
    if (active) {
      // remove "val" from the array
      const vIndex = selectArr.indexOf(val);
      if (vIndex > -1) {
        selectArr.splice(vIndex, 1);
      }
    } else {
      selectArr.push(val);
    }

    let newState = {} as FilterCat;
    if (selectArr.length === 0) {
      newState = {
        name: filterState.name,
        varType: filterState.varType,
        orderValue: sortOrder,
      };
    } else {
      newState = {
        name: filterState.name,
        type: 'select',
        varType: filterState.varType,
        value: selectArr,
        orderValue: sortOrder,
      };
    }
    handleChange(newState);
  };

  const barCellRenderer = (x: GridCellProps) => {
    let barSize = 0;
    let barCt = 0;
    let barName = '';
    let barMax = 0;
    let active = true;

    const totSel = condDist.totSelected;

    // selected values always come first
    // so if rowIndex is less than total selected, grab those from condDist
    // so they show up first
    // otherwise, grab the appropriate value from condDist
    // we also have to take into account whether the rows should be reversed or not
    let ridx;
    if (x.rowIndex < totSel) {
      ridx = condDist.reverseRows ? x.rowIndex : totSel - (x.rowIndex + 1);
    } else {
      ridx = condDist.reverseRows ? x.rowIndex : condDist.dist.length - (x.rowIndex - totSel + 1);
    }
    ridx = condDist.idx[ridx]; // eslint-disable-line prefer-destructuring

    active = x.rowIndex < totSel;
    barSize = condDist.dist[ridx].value;
    barCt = barSize;
    barName = condDist.dist[ridx].key;
    barMax = condDist.max;
    // each bar will have width of at least 1 so we can see it is there
    // allActive indicates that none are selected in the filter
    // in which case we want them to show up in color rather than gray
    return (
      <CatBar
        key={`${x.rowIndex}_${barCt}_${sortOrder}`}
        divStyle={x.style}
        // this is needed for the cellRenderer to work and not throw a warning
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: 2322
        style={null}
        active={active}
        allActive={filterState.value === undefined}
        height={cellHeight}
        width={(barSize / barMax) * (width - 1) + 1}
        onClick={() => handleSelect(barName, active)}
        d={{ ct: barCt, mct: dist.dist[barName], id: barName }}
      />
    );
  };

  const { orderValue } = condDist;
  const { totSelected } = condDist;
  const { sumSelected } = condDist;
  const fc = filterCardinality;

  return (
    // FIXME we should be able to fix this once updating react and react-virtualized
    // this issue is related to versioning of our dependencies
    // https://github.com/bvaughn/react-virtualized/issues/1739
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: 2786
    <Grid
      key={`${orderValue}_${totSelected}_${sumSelected}_${fc}`}
      width={width}
      height={height}
      columnWidth={width}
      rowHeight={cellHeight}
      columnCount={1}
      rowCount={condDist.dist.length}
      cellRenderer={barCellRenderer}
    />
  );
};

// ------ redux container ------

const stateSelector = createSelector(filterCardinalitySelector, (filterCardinality) => ({
  filterCardinality,
}));

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: TS2345
const mapStateToProps = (state: RootState) => stateSelector(state);

export default connect(mapStateToProps)(FilterCatPlot);
