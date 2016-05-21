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
// -   (TODO: scrolling should speed up the longer it is hovered)
// - click on scroll boxes advances to the beginning / end
// - sorting resets scroll to start
// - mousewheel scrolls boxes left and right (TODO: look into throttle for this)

import React from 'react';
import Radium from 'radium';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';

const sortOptions = [
  { payload: 'idx,asc', text: 'Order: default' },
  { payload: 'ct,asc', text: 'Order: count ascending' },
  { payload: 'ct,desc', text: 'Order: count descending' },
  { payload: 'id,asc', text: 'Order: label ascending' },
  { payload: 'id,desc', text: 'Order: label descending' }
];

const FilterCat = ({ filterState, style, handleChange }) => {
  const sortOrder = filterState.orderValue ? filterState.orderValue : 'idx,asc';
  const iconButtonElement = <IconButton iconClassName="icon-more_vert" />;
  const extraOptionsInput = (
    <IconMenu
      value={sortOrder}
      onChange={(e, value) => {
        handleChange(Object.assign(filterState, { orderValue: value }));
      }}
      style={style.extraOptionsInput}
      iconButtonElement={iconButtonElement}
      desktop
    >
      {sortOptions.map((d) => (
        <MenuItem primaryText={d.text} value={d.payload} key={d.payload} />
      ))}
    </IconMenu>
  );

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

  return (
    <div style={style.container}>
      <div
        style={style.plotContainer}
        // onMouseDown={}
        // onMouseLeave={}
        // onWheel={}
      >
      </div>
      <div style={style.inputContainer}>
        <TextField
          hintText="regex"
          ref="regexInput"
          key="regexInput"
          style={style.regexInput}
          desktop
          defaultValue={filterState.type === 'regex' ? filterState.value : ''}
          onChange={(e) => {
            let newState = {};
            if (e.target.value === '') {
              newState = {
                name: filterState.name,
                orderValue: sortOrder
              };
            } else {
              newState = {
                name: filterState.name,
                type: 'regex',
                value: e.target.value,
                orderValue: sortOrder
              };
            }
            // TODO: throttle this
            handleChange(newState);
          }}
        />
        {extraOptionsInput}
      </div>
    </div>
  );
};


FilterCat.propTypes = {
  filterState: React.PropTypes.object,
  style: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

export default Radium(FilterCat);
