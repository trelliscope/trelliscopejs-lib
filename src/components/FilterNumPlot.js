import React from 'react';
import NumHist from './FilterNumPlotHist';

class FilterNumPlot extends React.Component {
  constructor(props) {
    super(props);
    this.cellHeight = 15;
    // this.cellHeight = Math.max(15,
    //   this.props.style.height / this.props.condDist.orderKeys.length);
  }

  render() {
    return (
      <NumHist />
    );
  }
}

FilterNumPlot.propTypes = {
  style: React.PropTypes.object,
  dist: React.PropTypes.object,
  filterState: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

export default FilterNumPlot;
