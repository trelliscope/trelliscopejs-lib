// click on a bar selects it
// multiple bars can be selected with additional clicks
// click on a selected bar deselects it
// regex overrides manual selections
// if selections are made after regex, regex is cleared

import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { debounce } from 'throttle-debounce';
import FilterCatPlot from './FilterCatPlot';
import uiConsts from '../assets/styles/uiConsts';

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
    const { filterState } = this.props;
    this.handleRegex = debounce(400, this.handleRegex);
    this.sortOrder = filterState.orderValue
      ? filterState.orderValue : 'ct,desc';
  }

  componentWillUpdate(nextProps) {
    const { filterState } = this.props;
    this.sortOrder = filterState.orderValue
      ? filterState.orderValue : 'ct,desc';

    if (nextProps.filterState.type !== 'regex') {
      // hacky way to clear regex field after it switches to selection
      // until material-ui is fixed and we can change to controlled input
      // https://github.com/callemall/@material-ui/core/pull/3673
      this._TextField.input.value = '';
      this._TextField.state.hasValue = false;
    }
  }

  handleRegex(val) {
    const { filterState, levels, handleChange } = this.props;
    let newState = {};
    if (val === '') {
      newState = {
        name: filterState.name,
        varType: filterState.varType,
        orderValue: this.sortOrder
      };
    } else {
      const vals = [];
      const rval = new RegExp(val, 'i');
      for (let j = 0; j < levels.length; j += 1) {
        if (levels[j].match(rval) !== null) {
          vals.push(levels[j]);
        }
      }
      newState = {
        name: filterState.name,
        type: 'regex',
        varType: filterState.varType,
        regex: val,
        value: vals,
        orderValue: this.sortOrder
      };
    }
    handleChange(newState);
  }

  render() {
    const {
      classes, handleSortChange, filterState, height, dist, condDist, handleChange
    } = this.props;

    const regexInput = {
      width: uiConsts.sidebar.width - 40,
      marginTop: -8,
      fontSize: 16,
      transform: 'scale(0.85)',
      transformOrigin: '0 0'
    };

    const iconButtonElement = <IconButton iconClassName="icon-more_vert" />;
    const extraOptionsInput = (
      <Menu
        value={this.sortOrder}
        onChange={(e, value) => {
          handleSortChange(Object.assign(filterState,
            { orderValue: value }));
        }}
        className={classes.extraOptionsInput}
        iconButtonElement={iconButtonElement}
        desktop
      >
        {sortOptions.map(d => (
          <MenuItem primaryText={d.text} value={d.payload} key={d.payload} />
        ))}
      </Menu>
    );

    return (
      <div className={classes.container}>
        <div
          className={classes.plotContainer}
        >
          <FilterCatPlot
            className={classes.plotContainer}
            height={height}
            width={uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2)}
            cellHeight={15}
            dist={dist}
            condDist={condDist}
            filterState={filterState}
            handleChange={handleChange}
            sortOrder={this.sortOrder}
          />
        </div>
        <div className={classes.inputContainer}>
          <TextField
            ref={(d) => { this._TextField = d; }}
            placeholder="regex"
            style={regexInput}
            defaultValue={filterState.type === 'regex' ? filterState.regex : ''}
            onChange={e => this.handleRegex(e.target.value)}
          />
          {extraOptionsInput}
        </div>
      </div>
    );
  }
}

FilterCat.propTypes = {
  classes: PropTypes.object.isRequired,
  filterState: PropTypes.object.isRequired,
  dist: PropTypes.object.isRequired,
  condDist: PropTypes.object.isRequired,
  levels: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSortChange: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  container: {
    width: uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2),
    boxSizing: 'border-box',
    paddingLeft: uiConsts.sidebar.filter.margin,
    paddingRight: uiConsts.sidebar.filter.margin,
    paddingTop: uiConsts.sidebar.filter.margin
  },
  plotContainer: {
    width: uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2),
    // height: uiConsts.sidebar.filter.cat.height,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    userSelect: 'none',
    zIndex: 1000
  },
  inputContainer: {
    height: 39,
    width: uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2),
    marginBottom: -14,
    zIndex: 100,
    position: 'relative'
  },
  extraOptionsInput: {
    float: 'right',
    width: 28,
    marginTop: -6,
    transform: 'scale(0.85)',
    transformOrigin: '0 0'
  }
};

export default injectSheet(staticStyles)(FilterCat);
