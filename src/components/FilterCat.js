// click on a bar selects it
// multiple bars can be selected with additional clicks
// click on a selected bar deselects it
// regex overrides manual selections
// if selections are made after regex, regex is cleared

import React from 'react';
import Radium from 'radium';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';
import FilterCatPlot from './FilterCatPlot';

const sortOptions = [
  // { payload: 'idx,asc', text: 'Order: default' },
  { payload: 'ct,asc', text: 'Order: count ascending' },
  { payload: 'ct,desc', text: 'Order: count descending' },
  { payload: 'id,asc', text: 'Order: label ascending' },
  { payload: 'id,desc', text: 'Order: label descending' }
];

class FilterCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleRegex = debounce(400, this.handleRegex);
    this.sortOrder = this.props.filterState.orderValue ?
      this.props.filterState.orderValue : 'ct,desc';
  }
  componentWillUpdate(nextProps) {
    this.sortOrder = this.props.filterState.orderValue ?
      this.props.filterState.orderValue : 'ct,desc';

    if (nextProps.filterState.type !== 'regex') {
      // hacky way to clear regex field after it switches to selection
      // until material-ui is fixed and we can change to controlled input
      // https://github.com/callemall/material-ui/pull/3673
      this._TextField.input.value = '';
      this._TextField.state.hasValue = false;
    }
  }
  handleRegex(val) {
    let newState = {};
    if (val === '') {
      newState = {
        name: this.props.filterState.name,
        varType: this.props.filterState.varType,
        orderValue: this.sortOrder
      };
    } else {
      const vals = [];
      const rval = new RegExp(val, 'i');
      for (let j = 0; j < this.props.levels.length; j += 1) {
        if (this.props.levels[j].match(rval) !== null) {
          vals.push(this.props.levels[j]);
        }
      }
      newState = {
        name: this.props.filterState.name,
        type: 'regex',
        varType: this.props.filterState.varType,
        regex: val,
        value: vals,
        orderValue: this.sortOrder
      };
    }
    this.props.handleChange(newState);
  }
  render() {
    const iconButtonElement = <IconButton iconClassName="icon-more_vert" />;
    const extraOptionsInput = (
      <IconMenu
        value={this.sortOrder}
        onChange={(e, value) => {
          this.props.handleSortChange(Object.assign(this.props.filterState,
            { orderValue: value }));
        }}
        style={this.props.style.extraOptionsInput}
        iconButtonElement={iconButtonElement}
        desktop
      >
        {sortOptions.map((d) => (
          <MenuItem primaryText={d.text} value={d.payload} key={d.payload} />
        ))}
      </IconMenu>
    );

    return (
      <div style={this.props.style.container}>
        <div
          style={this.props.style.plotContainer}
        >
          <FilterCatPlot
            style={this.props.style.plotContainer}
            dist={this.props.dist}
            condDist={this.props.condDist}
            filterState={this.props.filterState}
            handleChange={this.props.handleChange}
          />
        </div>
        <div style={this.props.style.inputContainer}>
          <TextField
            ref={d => { this._TextField = d; }}
            hintText="regex"
            style={this.props.style.regexInput}
            defaultValue={this.props.filterState.type === 'regex' ?
              this.props.filterState.regex : ''}
            onChange={(e) => this.handleRegex(e.target.value)}
          />
          {extraOptionsInput}
        </div>
      </div>
    );
  }
}

FilterCat.propTypes = {
  filterState: React.PropTypes.object,
  style: React.PropTypes.object,
  dist: React.PropTypes.object,
  condDist: React.PropTypes.object,
  levels: React.PropTypes.array,
  handleChange: React.PropTypes.func,
  handleSortChange: React.PropTypes.func
};

export default Radium(FilterCat);
