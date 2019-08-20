import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid } from 'react-virtualized';
import { filterCardinalitySelector } from '../selectors/cogData';
import CatBar from './FilterCatPlotBar';

class FilterCatPlot extends React.Component {
  // columnIndex, // Horizontal (column) index of cell
  // isScrolling, // The Grid is currently being scrolled
  // isVisible,   // This cell is visible within the grid (eg it is not an overscanned cell)
  // key,         // Unique key within array of cells
  // rowIndex,    // Vertical (row) index of cell
  // style        // Style object to be applied to cell (to position it)
  barCellRenderer = (x) => {
    const {
      condDist, sortOrder, filterState, cellHeight, width, dist
    } = this.props;

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
      ridx = condDist.reverseRows
        ? x.rowIndex : totSel - (x.rowIndex + 1);
    } else {
      ridx = condDist.reverseRows
        ? x.rowIndex : condDist.dist.length - ((x.rowIndex - totSel) + 1);
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
        // key={x.key}
        style={null}
        divStyle={x.style}
        active={active}
        allActive={filterState.value === undefined}
        height={cellHeight}
        width={((barSize / barMax) * (width - 1)) + 1}
        handleClick={() => this.handleSelect(barName, active)}
        d={{ ct: barCt, mct: dist.dist[barName], id: barName }}
      />
    );
  }

  handleSelect(val, active) {
    const { filterState, sortOrder, handleChange } = this.props;

    const selectArr = Object.assign([], filterState.value);
    if (active) {
      // remove "val" from the array
      const vIndex = selectArr.indexOf(val);
      if (vIndex > -1) {
        selectArr.splice(vIndex, 1);
      }
    } else {
      selectArr.push(val);
    }

    let newState = {};
    if (selectArr.length === 0) {
      newState = {
        name: filterState.name,
        varType: filterState.varType,
        orderValue: sortOrder
      };
    } else {
      newState = {
        name: filterState.name,
        type: 'select',
        varType: filterState.varType,
        value: selectArr,
        orderValue: sortOrder
      };
    }
    handleChange(newState);
  }

  render() {
    const {
      condDist, filterCardinality, width, height, cellHeight
    } = this.props;

    const { orderValue } = condDist;
    const { totSelected } = condDist;
    const { sumSelected } = condDist;
    const fc = filterCardinality;

    return (
      <Grid
        key={`${orderValue}_${totSelected}_${sumSelected}_${fc}`}
        width={width}
        height={height}
        columnWidth={width}
        rowHeight={cellHeight}
        columnCount={1}
        rowCount={condDist.dist.length}
        cellRenderer={this.barCellRenderer}
        // cellRenderer={({ columnIndex, isScrolling, rowIndex }) => list[rowIndex][columnIndex]}
      />
    );
  }
}

FilterCatPlot.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  cellHeight: PropTypes.number.isRequired,
  dist: PropTypes.object.isRequired,
  condDist: PropTypes.object.isRequired,
  filterState: PropTypes.object.isRequired,
  sortOrder: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  filterCardinality: PropTypes.number.isRequired
};

// ------ redux container ------

const stateSelector = createSelector(
  filterCardinalitySelector,
  (filterCardinality) => ({
    filterCardinality
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(FilterCatPlot);
