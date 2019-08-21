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
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import { debounce } from 'throttle-debounce';
// import Mousetrap from 'mousetrap';
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
    // this.handleRegex = debounce(400, this.handleRegex);
    this.sortOrder = filterState.orderValue
      ? filterState.orderValue : 'ct,desc';
    this.state = { menuOpen: false, anchorEl: null };
  }

  UNSAFE_componentWillUpdate() { // eslint-disable-line camelcase
    const { filterState } = this.props;
    this.sortOrder = filterState.orderValue
      ? filterState.orderValue : 'ct,desc';
  }

  handleMenuClose = () => {
    this.setState({ menuOpen: false });
  }

  handleMenuIconClick = (event) => {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
    this.setState({ anchorEl: menuOpen ? null : event.currentTarget });
    // if (menuOpen) {
    //   Mousetrap.unbind('esc');
    // } else {
    //   Mousetrap.bind('esc', this.handleMenuClose);
    // }
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
      levels.forEach((d) => { if (d.match(rval) !== null) { vals.push(d); } });
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

    const { menuOpen, anchorEl } = this.state;

    // const iconButtonElement = <IconButton iconClassName="icon-more_vert" />;
    const extraOptionsInput = (
      <div className={classes.extraOptionsInput}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={this.handleMenuIconClick}
          // onClose={this.handleMenuClose}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          open={menuOpen}
          anchorEl={anchorEl}
          onClose={this.handleMenuClose}
          // keepMounted
          // PaperProps={{
          //   style: {
          //     maxHeight: 48 * 4.5,
          //     width: 200
          //   }
          // }}
          // className={classes.extraOptionsInput}
        >
          {sortOptions.map((d) => (
            <MenuItem
              key={d.payload}
              selected={d.payload === filterState.orderValue}
              onClick={() => {
                handleSortChange(Object.assign(filterState,
                  { orderValue: d.payload }));
                this.handleMenuClose();
              }}
            >
              {d.text}
            </MenuItem>
          ))}
        </Menu>
      </div>
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
            placeholder="regex"
            style={regexInput}
            value={filterState.type === 'regex' ? filterState.regex : ''}
            onChange={(e) => this.handleRegex(e.target.value)}
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
    marginBottom: -21,
    paddingTop: 7,
    zIndex: 100,
    position: 'relative'
  },
  extraOptionsInput: {
    // position: 'absolute',
    // top: -8,
    // right: -10,
    float: 'right',
    marginTop: -6,
    width: 28,
    transform: 'scale(0.6)',
    transformOrigin: '0 0'
  }
  // position: absolute;
  // top: -8px;
  // right: -10px;
};

export default injectSheet(staticStyles)(FilterCat);
