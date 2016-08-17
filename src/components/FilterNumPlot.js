import React from 'react';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select, event as currentEvent } from 'd3-selection';
import { brushX } from 'd3-brush';
// import { arc } from 'd3-shape';

const HistPlotD3 = {};

class FilterNumPlot extends React.Component {
  componentDidMount() {
    // we don't expect most props to change so we'll set things here
    // so we don't recompute every time the plots updates
    // the one thing that can change is the domain of ys
    const axisPad = 20;
    const sidePad = 5;
    const delta = this.props.condDist.delta;
    const xrange = [this.props.condDist.breaks[0],
      this.props.condDist.breaks[this.props.condDist.breaks.length - 1] + delta];
    const xs = scaleLinear()
      .domain(xrange)
      .range([sidePad, this.props.style.width - sidePad]);
    const ys = scaleLinear()
      .domain([0, this.props.condDist.max])
      .range([this.props.style.height - axisPad, 0]);
    const axis = axisBottom(ys)
      .scale(xs)
      .ticks(5)
      .tickSize(4);
    const height = this.props.style.height - axisPad;
    const barWidth = xs(delta) - xs(0);

    const barPath = (dat, pars) => {
      const path = [];
      let i = -1;
      const n = dat.length;
      let d;
      while (++i < n) {
        d = dat[i];
        path.push('M', pars.xs(d.key) + 1, ',', pars.height, 'V',
          pars.ys(d.value) - 1, // -1 will ensure bars are visible
          'h', pars.barWidth - 1, 'V', pars.height);
      }
      return path.join('');
    };

    this.d3pars = {
      axisPad,
      sidePad,
      delta,
      xrange,
      xs,
      ys,
      axis,
      height,
      barWidth,
      barPath
    };

    this._d3node
      .call(HistPlotD3.enter.bind(this, this.props, this.d3pars));
  }
  shouldComponentUpdate() {
    return true;
  }
  componentDidUpdate() {
    this.d3pars.ys.domain([0, this.props.condDist.max]);
    this._d3node
      .call(HistPlotD3.update.bind(this, this.props, this.d3pars));
  }
  render() {
    return (
      <svg
        ref={d => { this._d3node = select(d); }}
        width={this.props.style.width}
        height={this.props.style.height}
      />
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

HistPlotD3.enter = (props, pars, selection) => {
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
        const newRange = currentEvent.selection.map(d => fixNumber(pars.xs.invert(d)));
        props.handleChange(newRange);
      } else {
        selection.select('#cliprect')
          .attr('x', pars.xs(pars.xrange[0]))
          .attr('width', pars.xs(pars.xrange[1]) - pars.xs(pars.xrange[0]));
        props.handleChange(undefined);
      }
    }
  };

  const histBrush = brushX()
    .extent([[pars.sidePad, 0], [props.style.width - pars.sidePad, pars.height]])
    .handleSize(10);

  histBrush
    .on('brush', brushClipMove)
    .on('end', brushed);

  const plotArea = selection.append('g');

  const selRange = Object.assign([], pars.xrange);
  if (props.filterState.value) {
    if (props.filterState.value.from) {
      selRange[0] = props.filterState.value.from;
    }
    if (props.filterState.value.to) {
      selRange[1] = props.filterState.value.to;
    }
  }

  // clipping region to match brush and hide foreground bars
  plotArea.append('clipPath')
    .attr('id', `clip-${props.name}`)
    .append('rect')
    .attr('id', 'cliprect')
    .attr('x', pars.xs(selRange[0]))
    .attr('width', pars.xs(selRange[1]) - pars.xs(selRange[0]))
    .attr('height', props.style.height - pars.axisPad);

  // background bars
  plotArea.append('path')
    .attr('class', 'bar')
    .datum(props.condDist.dist)
    .attr('fill', '#ccc');

  plotArea.append('path')
    .attr('class', 'bar')
    .datum(props.condDist.dist)
    .attr('clip-path', `url(#clip-${props.name})`)
    .attr('fill', '#1f77b4');

  const gAxis = selection.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${(props.style.height - pars.axisPad) + 1})`)
    .call(pars.axis);

  // style the axis
  gAxis.select('path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-opacity', 0.4)
    .attr('shape-rendering', 'crispEdges');
  gAxis.selectAll('.tick')
    .attr('opacity', 0.4);
  // gAxis.selectAll('.tick text')
  //   .attr('font', '10px');

  const gBrush = plotArea.append('g')
    .attr('class', 'brush')
    .call(histBrush)
    .call(histBrush.move, [pars.xs(selRange[0]), pars.xs(selRange[1])]);

  // style the brush
  gBrush.select('rect.selection')
    .attr('fill', '#1f77b4')
    .attr('fill-opacity', '0.125')
    .attr('stroke-opacity', '0.5');

  gBrush.selectAll('rect')
    .attr('height', pars.height);

  selection.selectAll('.bar').attr('d', d => pars.barPath(d, pars));
};

HistPlotD3.update = (props, pars, selection) => {
  selection.selectAll('.bar')
    .attr('d', null)
    .datum(props.condDist.dist)
    .attr('d', d => pars.barPath(d, pars));

  // brush needs to reflect updated range
  if (props.filterState.value !== undefined) {
    let fFrom = props.filterState.value.from;
    let fTo = props.filterState.value.to;

    // explicitly set from = min or to = max if not specified
    if (fFrom === undefined) {
      fFrom = pars.xrange[0];
    }
    if (fTo === undefined) {
      fTo = pars.xrange[1];
    }
    //
    if (fTo > fFrom) {
      selection.select('.brush')
        .call(brushX().move, [pars.xs(fFrom), pars.xs(fTo)]);
      // make sure the selection matches the new brush
      selection.select('#cliprect')
        .attr('x', pars.xs(fFrom))
        .attr('width', pars.xs(fTo) - pars.xs(fFrom));
    }
  } else {
    // we need to remove the brush
    selection.select('.brush')
      .call(brushX().move, null);
  }
};
