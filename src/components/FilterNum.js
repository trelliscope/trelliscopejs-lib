import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import TextField from '@material-ui/core/TextField';
// import { debounce } from 'throttle-debounce';
import FilterNumPlot from './FilterNumPlot';
import uiConsts from '../assets/styles/uiConsts';

class FilterNum extends React.Component {
  constructor(props) {
    super(props);
    // this.handleInput = debounce(400, this.handleInput);
    this.stateValue = {};
    this.handleBrushInput = this.handleBrushInput.bind(this);
  }

  componentDidUpdate() {
    const { filterState } = this.props;
    // if component is updated with empty state, make sure text fields are empty
    if (filterState.value === undefined && this._fromInput && this._toInput) {
      this._fromInput.input.value = null;
      this._toInput.input.value = null;
    }
  }

  setValidState(lower, upper, which) {
    const { filterState, handleChange } = this.props;
    const valid = this.checkValidNumber(lower, upper, which);
    if (filterState.valid === undefined || filterState.valid !== valid) {
      handleChange(Object.assign(filterState, { valid }));
    }
  }

  handleInput(val, which) {
    const { filterState, handleChange } = this.props;
    let newState = {};
    const newVal = val === '' ? undefined : parseFloat(val);
    const lower = which === 'from' ? newVal : this.stateValue.from;
    const upper = which === 'to' ? newVal : this.stateValue.to;
    if (lower === undefined && upper === undefined) {
      newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        valid: true
      };
    } else {
      newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        value: {
          from: lower,
          to: upper
        },
        valid: this.checkValidNumber(lower, upper, which)
      };
    }
    handleChange(newState);
  }

  handleBrushInput(values) {
    const { filterState, handleChange } = this.props;
    if (values === undefined) {
      const newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        valid: true
      };
      handleChange(newState);

      if (this._fromInput && this._toInput) {
        this._fromInput.input.value = null;
        this._toInput.input.value = null;
      }
    } else {
      const newState = {
        name: filterState.name,
        type: 'range',
        varType: filterState.varType,
        value: {
          from: values[0],
          to: values[1]
        },
        valid: true
      };
      handleChange(newState);

      if (this._fromInput && this._toInput) {
        [this._fromInput.input.value, this._toInput.input.value] = values;
      }
    }
  }

  checkValidNumber(lower, upper, which) {
    if (which === 'to') {
      if (lower && parseFloat(lower) > parseFloat(upper)) {
        return false;
      }
    } else if (upper && parseFloat(upper) < parseFloat(lower)) {
      return false;
    }
    return true;
  }

  render() {
    const {
      classes, filterState, dist, condDist, name
    } = this.props;

    // const underlineStyle = {
    //   bottom: 10
    // };

    const validStyle = { textAlign: 'center' };
    if (filterState.valid !== undefined && !filterState.valid) {
      validStyle.color = 'red';
    }

    const rangeInput = {
      width: 75,
      marginTop: -5,
      fontSize: 16,
      transform: 'scale(0.85)',
      transformOrigin: '0 0'
    };

    const inputStyle = { textAlign: 'center', paddingBottom: 2 };

    this.stateValue = filterState.value;
    if (this.stateValue === undefined) {
      this.stateValue = {};
    }

    const { to, from } = this.stateValue;
    if (to && from && to < from) {
      inputStyle.color = 'red';
    }

    // calculate step value for numeric input
    const { breaks } = dist.dist.raw;
    const hspan = (breaks[1] - breaks[0]) * breaks.length;
    const step = 10 ** Math.round(Math.log10(hspan / 100) - 0.4);

    return (
      <div className={classes.container}>
        <div
          className={classes.plotContainer}
        >
          <FilterNumPlot
            name={name}
            className={classes.plotContainer}
            width={uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2)}
            height={uiConsts.sidebar.filter.num.height}
            dist={dist}
            condDist={condDist}
            filterState={filterState}
            handleChange={this.handleBrushInput}
          />
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.rangeInputText}>Range:</div>
          <TextField
            // hintText="from"
            name="fromText"
            style={rangeInput}
            inputProps={{
              style: inputStyle
            }}
            // inputStyle={validStyle}
            // underlineStyle={underlineStyle}
            type="number"
            step={step}
            value={this.stateValue.from ? this.stateValue.from : ''}
            onChange={(e) => this.handleInput(e.target.value, 'from')}
            // onKeyDown={e => this.setValidState(
            //   e.target.value,
            //   this.stateValue.to,
            //   'from'
            // )}
          />
          <div className={`${classes.rangeInputText} ${classes.rangeInputTextDash}`}>
            -
          </div>
          <TextField
            // hintText="to"
            name="toText"
            style={rangeInput}
            inputProps={{
              style: inputStyle
            }}
            // inputStyle={validStyle}
            // underlineStyle={underlineStyle}
            type="number"
            step={step}
            value={this.stateValue.to ? this.stateValue.to : ''}
            onChange={(e) => this.handleInput(e.target.value, 'to')}
            // onKeyDown={e => this.setValidState(
            //   this.stateValue.from,
            //   e.target.value,
            //   'to'
            // )}
          />
        </div>
      </div>
    );
  }
}

FilterNum.propTypes = {
  name: PropTypes.string.isRequired,
  filterState: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  dist: PropTypes.object.isRequired,
  condDist: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  container: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  },
  plotContainer: {
    width: uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2),
    height: uiConsts.sidebar.filter.num.height,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'default',
    userSelect: 'none',
    zIndex: 1000
  },
  inputContainer: {
    width: uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2),
    marginBottom: -12,
    paddingBottom: 8,
    paddingTop: 4,
    zIndex: 100,
    position: 'relative',
    verticalAlign: 'center'
  },
  rangeInputText: {
    fontSize: 13,
    paddingRight: 10,
    display: 'inline-block'
  },
  rangeInputTextDash: {
    paddingLeft: 4,
    transform: 'scale(2,1)' // to deal with some browsers not being able to handle endash
  }
};

export default injectSheet(staticStyles)(FilterNum);
