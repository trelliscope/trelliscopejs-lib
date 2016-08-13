import React from 'react';
import { Grid } from 'react-virtualized';
import CatBar from './FilterCatPlotBar';

class FilterCatPlot extends React.Component {
  constructor(props) {
    super(props);
    this.cellHeight = 15;
    // this.cellHeight = Math.max(15,
    //   this.props.style.height / this.props.condDist.orderKeys.length);
  }
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
        orderValue: this.sortOrder
      };
    } else {
      newState = {
        name: this.props.filterState.name,
        type: 'select',
        varType: this.props.filterState.varType,
        value: selectArr,
        orderValue: this.sortOrder
      };
    }

    this.props.handleChange(newState);
  }
  barCellRenderer = (x) => {
    let barSize = 0;
    let barCt = 0;
    let barName = '';
    let barMax = 0;
    let active = true;

    let ridx = this.props.condDist.reverseRows ?
      x.rowIndex : this.props.condDist.dist.length - (x.rowIndex + 1);
    ridx = this.props.condDist.idx[ridx];

    active = x.rowIndex < this.props.condDist.totSelected;
    barSize = this.props.condDist.dist[ridx].value;
    barCt = barSize;
    barName = this.props.condDist.dist[ridx].key;
    barMax = this.props.condDist.max;

    return (
      <CatBar
        key={`${x.rowIndex}_${barCt}`}
        active={active}
        height={this.cellHeight}
        width={(barSize / barMax) * this.props.style.width}
        totWidth={this.props.style.width}
        handleClick={() => this.handleSelect(barName, active)}
        d={{ ct: barCt, mct: this.props.dist.dist[barName], id: barName }}
      />
    );
  }
  render() {
    const orderValue = this.props.condDist.orderValue;
    const totSelected = this.props.condDist.totSelected;
    const sumSelected = this.props.condDist.sumSelected;
    const maxVal = this.props.condDist.max;

    return (
      <Grid
        key={`${orderValue}_${totSelected}_${sumSelected}_${maxVal}`}
        width={this.props.style.width}
        height={this.props.style.height}
        columnWidth={this.props.style.width}
        rowHeight={this.cellHeight}
        columnCount={1}
        rowCount={this.props.condDist.dist.length}
        cellRenderer={this.barCellRenderer}
        // cellRenderer={({ columnIndex, isScrolling, rowIndex }) => list[rowIndex][columnIndex]}
      />
    );
  }
}

FilterCatPlot.propTypes = {
  style: React.PropTypes.object,
  dist: React.PropTypes.object,
  condDist: React.PropTypes.object,
  filterState: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

export default FilterCatPlot;
