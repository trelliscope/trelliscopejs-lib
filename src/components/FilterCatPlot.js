import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Grid } from 'react-virtualized';
import { filterCardinalitySelector } from '../selectors/cogData';
import CatBar from './FilterCatPlotBar';

class FilterCatPlot extends React.Component {
  handleSelect(val, active) {
    const selectArr = Object.assign([], this.props.filterState.value);
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
        name: this.props.filterState.name,
        varType: this.props.filterState.varType,
        orderValue: this.props.sortOrder
      };
    } else {
      newState = {
        name: this.props.filterState.name,
        type: 'select',
        varType: this.props.filterState.varType,
        value: selectArr,
        orderValue: this.props.sortOrder
      };
    }
    this.props.handleChange(newState);
  }
  // columnIndex, // Horizontal (column) index of cell
  // isScrolling, // The Grid is currently being scrolled
  // isVisible,   // This cell is visible within the grid (eg it is not an overscanned cell)
  // key,         // Unique key within array of cells
  // rowIndex,    // Vertical (row) index of cell
  // style        // Style object to be applied to cell (to position it)
  barCellRenderer = (x) => {
    let barSize = 0;
    let barCt = 0;
    let barName = '';
    let barMax = 0;
    let active = true;

    const totSel = this.props.condDist.totSelected;

    // selected values always come first
    // so if rowIndex is less than total selected, grab those from condDist
    // so they show up first
    // otherwise, grab the appropriate value from condDist
    // we also have to take into account whether the rows should be reversed or not
    let ridx;
    if (x.rowIndex < totSel) {
      ridx = this.props.condDist.reverseRows ?
        x.rowIndex : totSel - (x.rowIndex + 1);
    } else {
      ridx = this.props.condDist.reverseRows ?
        x.rowIndex : this.props.condDist.dist.length - ((x.rowIndex - totSel) + 1);
    }
    ridx = this.props.condDist.idx[ridx];

    active = x.rowIndex < totSel;
    barSize = this.props.condDist.dist[ridx].value;
    barCt = barSize;
    barName = this.props.condDist.dist[ridx].key;
    barMax = this.props.condDist.max;

    // each bar will have width of at least 1 so we can see it is there
    // allActive indicates that none are selected in the filter
    // in which case we want them to show up in color rather than gray
    return (
      <CatBar
        key={`${x.rowIndex}_${barCt}_${this.props.sortOrder}`}
        // key={x.key}
        divStyle={x.style}
        active={active}
        allActive={this.props.filterState.value === undefined}
        height={this.props.cellHeight}
        width={((barSize / barMax) * (this.props.width - 1)) + 1}
        handleClick={() => this.handleSelect(barName, active)}
        d={{ ct: barCt, mct: this.props.dist.dist[barName], id: barName }}
      />
    );
  }
  render() {
    const orderValue = this.props.condDist.orderValue;
    const totSelected = this.props.condDist.totSelected;
    const sumSelected = this.props.condDist.sumSelected;
    const fc = this.props.filterCardinality;

    return (
      <Grid
        key={`${orderValue}_${totSelected}_${sumSelected}_${fc}`}
        width={this.props.width}
        height={this.props.height}
        columnWidth={this.props.width}
        rowHeight={this.props.cellHeight}
        columnCount={1}
        rowCount={this.props.condDist.dist.length}
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
  filterCardinality => ({
    filterCardinality
  })
);

const mapStateToProps = state => (
  stateSelector(state)
);

export default connect(
  mapStateToProps
)(FilterCatPlot);
