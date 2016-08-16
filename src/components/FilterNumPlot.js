import React from 'react';
import ReactDOM from 'react-dom';
// import NumHist from './FilterNumPlotHist';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select, event } from 'd3-selection';
import { brushX } from 'd3-brush';
import { arc } from 'd3-shape';

const HistPlotD3 = {};

class FilterNumPlot extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.d3Node = select(ReactDOM.findDOMNode(this));
    this.d3Node
      .call(HistPlotD3.enter.bind(this, this.props));
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidUpdate() {
    this.d3Node
      .call(HistPlotD3.update.bind(this, this.props));
  }
  render() {
    return (
      <svg width={this.props.style.width} height={this.props.style.height} />
    );
  }
}

FilterNumPlot.propTypes = {
  name: React.PropTypes.string,
  style: React.PropTypes.object,
  dist: React.PropTypes.object,
  condDist: React.PropTypes.object,
  filterState: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

export default FilterNumPlot;

HistPlotD3.enter = (props, selection) => {

  const axisPad = 20;
  const sidePad = 5;
  const delta = props.condDist.delta;
  const xrange = [props.condDist.dist[0].key,
    props.condDist.dist[props.condDist.dist.length - 1].key + delta];
  const xs = scaleLinear()
    .domain(xrange)
    .range([sidePad, props.style.width - sidePad]);
  const ys = scaleLinear()
    .domain([0, props.condDist.max])
    .range([props.style.height - axisPad, 0]);
  const axis = axisBottom(ys)
    .scale(xs)
    .ticks(5);
  const height = props.style.height - axisPad;
  const barWidth = xs(delta) - xs(0);

  const barPath = (groups) => {
    const path = [];
    let i = -1;
    const n = groups.length;
    let d;
    while (++i < n) {
      d = groups[i];
      path.push('M', xs(d.key) + 1, ',', height, 'V', ys(d.value), 'h',
        barWidth - 1, 'V', height);
    }
    return path.join('');
  };

  const brushClipMove = () => {
    const curRange = event.selection;
    selection.select('#cliprect')
      .attr('x', curRange[0])
      .attr('width', curRange[1] - curRange[0]);
  };

  const brushed = () => {
    props.handleChange(Object.assign(props.filterState,
      {
        value: event.selection.map(xs.invert)
      }));
  };

  const histBrush = brushX()
    .extent([[sidePad, 0], [props.style.width - sidePad, height]])
    .handleSize(10)
    .on('brush', brushClipMove)
    .on('end', brushed);

  const plotArea = selection.append('g');

  const selRange = xrange;
  if (props.filterState.value) {
    if (props.filterState.value.from) {
      selRange[0] = props.filterState.value.from;
    }
    if (props.filterState.value.to) {
      selRange[1] = props.filterState.value.to;
    }
  }

  plotArea.append('clipPath')
    .attr('id', `clip-${props.name}`)
    .append('rect')
    .attr('id', 'cliprect')
    // .attr('width', props.style.width) // this will control selection
    .attr('x', xs(selRange[0]))
    .attr('width', xs(selRange[1]) - xs(selRange[0]))
    .attr('height', props.style.height - axisPad);

  plotArea.append('path')
    .attr('class', 'bar')
    .datum(props.condDist.dist)
    .attr('fill', 'lightgray');

  plotArea.append('path')
    .attr('class', 'bar')
    .datum(props.condDist.dist)
    .attr('clip-path', `url(#clip-${props.name})`)
    .attr('fill', 'steelblue');

  selection.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${props.style.height - axisPad})`)
    .call(axis);

  const gBrush = plotArea.append('g')
    .attr('class', 'brush')
    .call(histBrush)
    .call(histBrush.move, [xs(selRange[0]), xs(selRange[1])]);

  gBrush.selectAll('rect')
    .attr('height', height);

  selection.selectAll('.bar').attr('d', barPath);
};

HistPlotD3.update = (props, selection) => {

  const axisPad = 20;
  const sidePad = 5;
  const delta = props.condDist.delta;
  const xrange = [props.condDist.dist[0].key,
    props.condDist.dist[props.condDist.dist.length - 1].key + delta];
  const xs = scaleLinear()
    .domain(xrange)
    .range([sidePad, props.style.width - sidePad]);
  const ys = scaleLinear()
    .domain([0, props.condDist.max])
    .range([props.style.height - axisPad, 0]);
  const height = props.style.height - axisPad;
  const barWidth = xs(delta) - xs(0);

  const barPath = (groups) => {
    const path = [];
    let i = -1;
    const n = groups.length;
    let d;
    while (++i < n) {
      d = groups[i];
      path.push('M', xs(d.key) + 1, ',', height, 'V', ys(d.value), 'h',
        barWidth - 1, 'V', height);
    }
    return path.join('');
  };

  selection.selectAll('.bar')
    .attr('d', null)
    .datum(props.condDist.dist)
    .attr('d', barPath);
};
