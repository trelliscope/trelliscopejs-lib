import React from 'react';
import CatBar from './FilterCatPlotBar';
import { Grid } from 'react-virtualized';

class FilterCatPlot extends React.Component {
  constructor(props) {
    super(props);
    this.cellHeight = 15;
    this.condLength = this.props.condDist.orderKeys.length;
    this.margLength = this.props.condDist.morderKeys.length;
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

    if (rowIndex < this.props.condDist.orderKeys.length) {
      barSize = this.props.condDist.dist[this.props.condDist.orderKeys[rowIndex]];
      barCt = barSize;
      barName = this.props.condDist.orderKeys[rowIndex];
      barMax = this.props.condDist.max;
    } else if (rowIndex > this.props.condDist.orderKeys.length) {
      barSize = this.props.dist.dist[this.props.condDist.morderKeys[rowIndex - this.condLength]];
      barCt = 0;
      barName = this.props.condDist.morderKeys[rowIndex - this.condLength];
      barMax = this.props.dist.max;
    } else {
      return (
        <div
          style={{
            width: this.props.style.width,
            height: this.props.style.height - 1,
            fontSize: 10,
            textAlign: 'center',
            background: '#ddd'
          }}
        >
          Inactive:
        </div>
      );
    }

    return (
      <CatBar
        key={barName}
        height={this.cellHeight}
        width={barSize / barMax * this.props.style.width}
        totWidth={this.props.style.width}
        d={{ ct: barCt, mct: this.props.dist.dist[barName], id: barName }}
      />
    );
  }
  render() {
    return (
      <Grid
        key={this.props.condDist.orderValue}
        width={this.props.style.width}
        height={this.props.style.height}
        columnWidth={this.props.style.width}
        rowHeight={this.cellHeight}
        columnCount={1}
        rowCount={this.condLength + this.margLength}
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
