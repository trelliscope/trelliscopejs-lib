// behaviors:
// - click on a bar selects it
// - multiple bars can be selected with additional clicks
// - click on a selected bar deselects it
// - click outside a bar deselects everything
// - click and drag on bars selects everything the cursor comes across
// - (click and drag to deselect is not an option)
// - regex overrides manual selections
// - if selections are made after regex, regex is cleared
// - gray scroll boxes appear on either end if there are bars outside region
// - hover on scroll boxes advances in the direction of the box
// - click on scroll boxes advances to the beginning / end
// - sorting resets scroll to start
// - mousewheel scrolls boxes left and right

import React from 'react';
import Radium from 'radium';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';

const sortOptions = [
  { payload: 'idx,asc', text: 'Order: default' },
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
      this.props.filterState.orderValue : 'idx,asc';
  }
  componentWillUpdate() {
    this.sortOrder = this.props.filterState.orderValue ?
      this.props.filterState.orderValue : 'idx,asc';
  }
  handleRegex(val) {
    let newState = {};
    if (val === '') {
      newState = {
        name: this.props.filterState.name,
        orderValue: this.sortOrder
      };
    } else {
      newState = {
        name: this.props.filterState.name,
        type: 'regex',
        value: val,
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
        </div>
        <div style={this.props.style.inputContainer}>
          <TextField
            hintText="regex"
            style={this.props.style.regexInput}
            desktop
            defaultValue={this.props.filterState.type === 'regex' ?
              this.props.filterState.value : ''}
            onChange={(e) => this.handleRegex(e.target.value)}
          />
          {extraOptionsInput}
        </div>
      </div>
    );
  }
}

// {bars}
// <CatScroll
//   side={'left'}
//   setScroll={this._handleScroll}
//   key='leftScroll'
//   width={this.state.cfg.filter.scrollWidth}
//   startIndex={this.state.filter.startIndex}
//   endIndex={endIndex}
// />
// <CatScroll
//   side={'right'}
//   setScroll={this._handleScroll}
//   key='rightScroll'
//   width={this.state.cfg.filter.scrollWidth}
//   startIndex={this.state.filter.startIndex}
//   endIndex={endIndex}
// />

FilterCat.propTypes = {
  filterState: React.PropTypes.object,
  style: React.PropTypes.object,
  handleChange: React.PropTypes.func,
  handleSortChange: React.PropTypes.func
};

export default Radium(FilterCat);
