import React, { useEffect } from 'react';
import { NumberValue, ScaleLinear, scaleLinear } from 'd3-scale';
import { Axis, axisBottom } from 'd3-axis';
// TODO d3 needs to be updated, event is flagged because the types file that we installed is on a newer version
// and its not exported anymore, our typescript version is up to date and it also conflicts
// so this is needed until we update the d3-selection.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: TS2305
import { select, event as currentEvent, Selection, BaseType, filter } from 'd3-selection';
import { brushX } from 'd3-brush';

interface FilterNumPlotProps {
  name: string;
  width: number;
  height: number;
  condDist: CondDist;
  filterState: FilterNumPlotFilter;
  handleChange: (event: number[] | undefined) => void;
}

interface D3ParsType {
  axis: Axis<NumberValue>;
  axisPad: number;
  barPath: (dat: [{ key: number; value: number }], pars: D3ParsType) => string;
  barWidth: number;
  delta: number;
  height: number;
  sidePad: number;
  xrange: number[];
  xs: ScaleLinear<number, number>;
  ys: ScaleLinear<number, number>;
}

const FilterNumPlot: React.FC<FilterNumPlotProps> = ({ name, width, height, condDist, filterState, handleChange }) => {
  const HistPlotD3 = {} as filter;
  let d3pars = {} as D3ParsType;
  let d3node = {} as Selection<SVGGElement | BaseType, unknown, null, undefined>;

  useEffect(() => {
    // we don't expect most props to change so we'll set things here
    // so we don't recompute every time the plots updates
    // the one thing that can change is the domain of ys
    const axisPad = 16;
    const sidePad = 5;
    const { delta } = condDist;
    const xrange = [condDist.breaks[0], condDist.breaks[condDist.breaks.length - 1] + delta];
    const xs = scaleLinear()
      .domain(xrange)
      .range([sidePad, width - sidePad]);
    const ys = scaleLinear()
      .domain([0, condDist.max])
      .range([height - axisPad, 0]);
    const axis = axisBottom(ys).scale(xs).ticks(5).tickSize(4);
    const newHeight = height - axisPad;
    const barWidth = xs(delta) - xs(0);

    const barPath = (dat: [{ key: number; value: number }], pars: D3ParsType) => {
      const path = [];
      let i = 0;
      const n = dat.length;
      let d;
      let h;
      while (i < n) {
        d = dat[i];
        // will ensure bars with positive count are visible
        h = d.value === 0 ? pars.ys(d.value) : pars.ys(d.value) - 1;
        path.push('M', pars.xs(d.key) + 1, ',', pars.height, 'V', h, 'h', pars.barWidth - 1, 'V', pars.height);
        i += 1;
      }
      return path.join('');
    };

    d3pars = {
      axisPad,
      sidePad,
      delta,
      xrange,
      xs,
      ys,
      axis,
      height: newHeight,
      barWidth,
      barPath,
    };

    d3node.call(HistPlotD3.enter.bind(this, { name, width, height, condDist, filterState, handleChange }, d3pars));
  }, [filterState, d3node, name, width, height, condDist, handleChange]);

  useEffect(() => {
    d3pars?.ys?.domain([0, condDist?.max]);
    d3node.call(HistPlotD3.update.bind(this, { name, width, height, condDist, filterState, handleChange }, d3pars));
  }, [condDist]);

  HistPlotD3.enter = (props: FilterNumPlotProps, pars: D3ParsType, selection: filter) => {
    const brushClipMove = () => {
      const curRange = currentEvent.selection;
      selection
        .select('#cliprect')
        .attr('x', curRange[0])
        .attr('width', curRange[1] - curRange[0]);
    };

    // cut long decimals from the brush down to 5 significant digits
    // or in the case of numbers that are 10^5 or higher, just omit decimals
    const fixNumber = (x: number) => {
      const prec = Math.max(Math.floor(Math.log10(Math.abs(x))), 5);
      return parseFloat(x.toPrecision(prec));
    };

    const brushed = () => {
      if (currentEvent.sourceEvent) {
        if (currentEvent.selection) {
          const newRange = currentEvent.selection.map((d: number) => fixNumber(pars.xs.invert(d)));
          props.handleChange(newRange);
        } else {
          selection
            .select('#cliprect')
            .attr('x', pars.xs(pars.xrange[0]))
            .attr('width', pars.xs(pars.xrange[1]) - pars.xs(pars.xrange[0]));
          props.handleChange(undefined);
        }
      }
    };

    const histBrush = brushX()
      .extent([
        [pars.sidePad, 1],
        [props.width - pars.sidePad, pars.height + 1],
      ])
      .handleSize(10);

    histBrush.on('brush', brushClipMove).on('end', brushed);

    const plotArea = selection.append('g');

    const selRange = Object.assign([], pars.xrange) as number[];
    if (props.filterState.value) {
      if (props.filterState.value.from) {
        selRange[0] = props.filterState.value.from;
      }
      if (props.filterState.value.to) {
        selRange[1] = props.filterState.value.to;
      }
    }

    // clipping region to match brush and hide foreground bars
    plotArea
      .append('clipPath')
      .attr('id', `clip-${props.name}`)
      .append('rect')
      .attr('id', 'cliprect')
      .attr('x', pars.xs(selRange[0]))
      .attr('width', pars.xs(selRange[1]) - pars.xs(selRange[0]))
      .attr('height', props.height - pars.axisPad);

    // background bars
    plotArea.append('path').attr('class', 'bar background').datum(props.condDist.dist).attr('fill', '#ddd');

    plotArea
      .append('path')
      .attr('class', 'bar foreground')
      .datum(props.condDist.dist)
      .attr('clip-path', `url(#clip-${props.name})`);

    if (props.filterState.value) {
      plotArea.selectAll('.foreground').attr('fill', 'rgb(255, 170, 10)');
    } else {
      plotArea.selectAll('.foreground').attr('fill', 'rgb(255, 210, 127)');
    }

    const gAxis = selection
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${props.height - pars.axisPad + 1})`)
      .call(pars.axis);

    // style the axis
    gAxis
      .select('path')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.4)
      .attr('shape-rendering', 'crispEdges');
    gAxis.selectAll('.tick').attr('opacity', 0.4);

    const gBrush = plotArea.append('g').attr('class', 'brush').call(histBrush);

    if (props.filterState.value) {
      gBrush.call(histBrush.move, [pars.xs(selRange[0]), pars.xs(selRange[1])]);
    }

    // style the brush
    gBrush
      .select('rect.selection')
      .attr('fill', 'rgb(255, 210, 127)')
      .attr('fill-opacity', '0.125')
      .attr('stroke', 'rgb(255, 170, 10)')
      .attr('stroke-opacity', '0.2');

    gBrush.selectAll('rect').attr('height', pars.height);

    selection.selectAll('.bar').attr('d', (d: [{ key: number; value: number }]) => pars.barPath(d, pars));
  };

  HistPlotD3.update = (props: FilterNumPlotProps, pars: D3ParsType, selection: filter) => {
    selection
      .selectAll('.bar')
      .attr('d', null)
      .datum(props.condDist.dist)
      .attr('d', (d: [{ key: number; value: number }]) => pars.barPath(d, pars));

    // brush needs to reflect updated range
    if (props.filterState.value !== undefined) {
      let fFrom = props.filterState.value.from;
      let fTo = props.filterState.value.to;

      // explicitly set from = min or to = max if not specified
      if (fFrom === undefined) {
        fFrom = pars.xrange[0]; // eslint-disable-line prefer-destructuring
      }
      if (fTo === undefined) {
        fTo = pars.xrange[1]; // eslint-disable-line prefer-destructuring
      }
      //
      if (fTo > fFrom) {
        selection.select('.brush').call(brushX().move, [pars.xs(fFrom), pars.xs(fTo)]);
        // make sure the selection matches the new brush
        selection
          .select('#cliprect')
          .attr('x', pars.xs(fFrom))
          .attr('width', pars.xs(fTo) - pars.xs(fFrom));
        // set foreground to darker color
        selection.selectAll('path.foreground').attr('fill', 'rgb(255, 170, 10)');
      }
    } else {
      // we need to remove the brush
      selection.select('.brush').call(brushX().move, null);
      // set the foreground to a lighter orange
      selection.selectAll('path.foreground').attr('fill', 'rgb(255, 210, 127)');

      // and clear the mask
      selection
        .select('#cliprect')
        .attr('x', pars.xs(pars.xrange[0]))
        .attr('width', pars.xs(pars.xrange[1]) - pars.xs(pars.xrange[0]));
    }
  };

  return (
    <svg
      ref={(d: SVGGElement | BaseType) => {
        d3node = select(d);
      }}
      width={width}
      height={height}
    />
  );
};

export default FilterNumPlot;
