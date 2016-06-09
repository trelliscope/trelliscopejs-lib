import React from 'react';
import CatBar from './FilterCatPlotBar';
import { Grid } from 'react-virtualized';

class FilterCatPlot extends React.Component {
  constructor(props) {
    super(props);
    this.cellHeight = 15;
    // this.cellHeight = Math.max(15,
    //   this.props.style.height / this.props.condDist.orderKeys.length);
  }
  barCellRenderer = ({ columnIndex, isScrolling, rowIndex }) => {
    // let barSize = 0;
    // let barName = '';
    // if (this.props.dist.has_dist) {
    //   barSize = this.props.dist.dist.freq[rowIndex];
    //   barName = this.props.dist.dist.val[rowIndex];
    // }
    let barSize = 0;
    let barCt = 0;
    let barName = '';
    let barMax = 0;
    let active = true;

    const condLength = this.props.condDist.orderKeys.length;
    const margLength = this.props.condDist.morderKeys.length;
    const ridx = rowIndex - 1;
    const ridx2 = rowIndex - 2;

    if (rowIndex === 0) {

      return (
        <div
          key="activeDivider"
          style={{
            width: this.props.style.width,
            height: this.cellHeight - 1,
            fontSize: 10,
            textAlign: 'center',
            background: '#ddd'
          }}
        >
          {`${condLength} active${condLength > 0 ? ' (click a bar to remove)' : ''}`}
        </div>
      );
    } else if (ridx < condLength) {
      barSize = this.props.condDist.dist[this.props.condDist.orderKeys[ridx]];
      barCt = barSize;
      barName = this.props.condDist.orderKeys[ridx];
      barMax = this.props.condDist.max;
    } else if (ridx > condLength) {
      barSize = this.props.dist.dist[this.props.condDist.morderKeys[ridx2 - condLength]];
      barCt = 0;
      barName = this.props.condDist.morderKeys[ridx2 - condLength];
      barMax = this.props.dist.max;
      active = false;
    } else {
      return (
        <div
          key="inactiveDivider"
          style={{
            width: this.props.style.width,
            height: this.cellHeight - 1,
            fontSize: 10,
            textAlign: 'center',
            background: '#ddd'
          }}
        >
          {`${margLength} inactive${margLength > 0 ? ' (click a bar to add)' : ''}`}
        </div>
      );
    }

    return (
      <CatBar
        key={`${rowIndex}_${barCt}`}
        active={active}
        height={this.cellHeight}
        width={barSize / barMax * this.props.style.width}
        totWidth={this.props.style.width}
        d={{ ct: barCt, mct: this.props.dist.dist[barName], id: barName }}
      />
    );
  }
  render() {
    const condLength = this.props.condDist.orderKeys.length;
    const margLength = this.props.condDist.morderKeys.length;
    const orderValue = this.props.condDist.orderValue;
    const activeTot = this.props.condDist.activeTot;

    return (
      <Grid
        key={`${orderValue}${condLength}_${margLength}_${activeTot}`}
        width={this.props.style.width}
        height={this.props.style.height}
        columnWidth={this.props.style.width}
        rowHeight={this.cellHeight}
        columnCount={1}
        rowCount={condLength + margLength + 2}
        cellRenderer={this.barCellRenderer}
        // cellRenderer={({ columnIndex, isScrolling, rowIndex }) => list[rowIndex][columnIndex]}
      />
    );
  }
}

FilterCatPlot.propTypes = {
  style: React.PropTypes.object,
  dist: React.PropTypes.object,
  condDist: React.PropTypes.object
};

export default FilterCatPlot;
