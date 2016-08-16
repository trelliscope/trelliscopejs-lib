import React from 'react';
import ReactDOM from 'react-dom';
// import NumHist from './FilterNumPlotHist';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select, event as currentEvent } from 'd3-selection';
import { brushX } from 'd3-brush';
// import { arc } from 'd3-shape';

const HistPlotD3 = {};

class FilterNumPlot extends React.Component {
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
  const xrange = [props.condDist.breaks[0],
    props.condDist.breaks[props.condDist.breaks.length - 1] + delta];
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
    const curRange = currentEvent.selection;
    selection.select('#cliprect')
      .attr('x', curRange[0])
      .attr('width', curRange[1] - curRange[0]);
  };

  // cut long decimals from the brush down to 5 significant digits
  // or in the case of numbers that are 10^5 or higher, just omit decimals
  const fixNumber = (x) => {
    const prec = Math.max(Math.floor(Math.log10(Math.abs(x))), 5);
    return parseFloat(x.toPrecision(prec));
  };

  const brushed = () => {
    if (currentEvent.sourceEvent) {
      if (currentEvent.selection) {
        const newRange = currentEvent.selection.map(d => fixNumber(xs.invert(d)));
        props.handleChange(newRange);
      } else {
        const fullRange = [props.condDist.breaks[0],
          props.condDist.breaks[props.condDist.breaks.length - 1] + delta];
        selection.select('#cliprect')
          .attr('x', xs(fullRange[0]))
          .attr('width', xs(fullRange[1]) - xs(fullRange[0]));
        props.handleChange(undefined);
      }
    }
  };

  const histBrush = brushX()
    .extent([[sidePad, 0], [props.style.width - sidePad, height]])
    .handleSize(10);

  // if (props.filterState.value === undefined) {
  //   histBrush
  //     .call(brushX().move, []);
  // }

  histBrush
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
  const xrange = [props.condDist.breaks[0],
    props.condDist.breaks[props.condDist.breaks.length - 1] + delta];
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

  // brush needs to reflect updated range
  if (props.filterState.value !== undefined) {
    let fFrom = props.filterState.value.from;
    let fTo = props.filterState.value.to;

    // explicitly set from = min or to = max if not specified
    if (fFrom === undefined) {
      fFrom = xrange[0];
    }
    if (fTo === undefined) {
      fTo = xrange[1];
    }
    //
    if (fTo > fFrom) {
      selection.select('.brush')
        .call(brushX().move, [xs(fFrom), xs(fTo)]);
      // make sure the selection matches the new brush
      selection.select('#cliprect')
        .attr('x', xs(fFrom))
        .attr('width', xs(fTo) - xs(fFrom));
    }
  } else {
    // we need to remove the brush
    selection.select('.brush')
      .call(brushX().move, null);
  }
};
