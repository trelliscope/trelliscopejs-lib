import React from 'react';
import injectSheet from 'react-jss';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';
import FilterNumPlot from './FilterNumPlot';
import uiConsts from '../assets/styles/uiConsts';

class FilterNum extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = debounce(400, this.handleInput);
    this.stateValue = {};
    this.handleBrushInput = this.handleBrushInput.bind(this);
  }
  componentDidUpdate() {
    // if component is updated with empty state, make sure text fields are empty
    if (this.props.filterState.value === undefined && this._fromInput && this._toInput) {
      this._fromInput.input.value = null;
      this._toInput.input.value = null;
    }
  }
  setValidState(lower, upper, which) {
    const valid = this.checkValidNumber(lower, upper, which);
    if (this.props.filterState.valid === undefined ||
      this.props.filterState.valid !== valid) {
      this.props.handleChange(Object.assign(this.props.filterState, { valid }));
    }
  }
  handleInput(val, which) {
    let newState = {};
    const newVal = val === '' ? undefined : parseFloat(val);
    const lower = which === 'from' ? newVal : this.stateValue.from;
    const upper = which === 'to' ? newVal : this.stateValue.to;
    if (lower === undefined && upper === undefined) {
      newState = {
        name: this.props.filterState.name,
        type: 'range',
        varType: this.props.filterState.varType,
        valid: true
      };
    } else {
      newState = {
        name: this.props.filterState.name,
        type: 'range',
        varType: this.props.filterState.varType,
        value: {
          from: lower,
          to: upper
        },
        valid: this.checkValidNumber(lower, upper, which)
      };
    }
    this.props.handleChange(newState);
  }
  handleBrushInput(values) {
    if (values === undefined) {
      const newState = {
        name: this.props.filterState.name,
        type: 'range',
        varType: this.props.filterState.varType,
        valid: true
      };
      this.props.handleChange(newState);

      if (this._fromInput && this._toInput) {
        this._fromInput.input.value = null;
        this._toInput.input.value = null;
      }
    } else {
      const newState = {
        name: this.props.filterState.name,
        type: 'range',
        varType: this.props.filterState.varType,
        value: {
          from: values[0],
          to: values[1]
        },
        valid: true
      };
      this.props.handleChange(newState);

      if (this._fromInput && this._toInput) {
        this._fromInput.input.value = values[0];
        this._toInput.input.value = values[1];
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
    const { classes } = this.props.sheet;

    const underlineStyle = {
      bottom: 10
    };

    const validStyle = { textAlign: 'center' };
    if (this.props.filterState.valid !== undefined && !this.props.filterState.valid) {
      validStyle.color = 'red';
    }

    const rangeInput = {
      width: 75,
      marginTop: -10,
      fontSize: 16,
      transform: 'scale(0.85)',
      transformOrigin: '0 0'
    };

    this.stateValue = this.props.filterState.value;
    if (this.stateValue === undefined) {
      this.stateValue = {};
    }

    // calculate step value for numeric input
    const breaks = this.props.dist.dist.raw.breaks;
    const hspan = (breaks[1] - breaks[0]) * breaks.length;
    const step = 10 ** Math.round(Math.log10(hspan / 100) - 0.4);

    return (
      <div className={classes.container}>
        <div
          className={classes.plotContainer}
        >
          <FilterNumPlot
            name={this.props.name}
            className={classes.plotContainer}
            width={uiConsts.sidebar.width - (uiConsts.sidebar.filter.margin * 2)}
            height={uiConsts.sidebar.filter.num.height}
            dist={this.props.dist}
            condDist={this.props.condDist}
            filterState={this.props.filterState}
            handleChange={this.handleBrushInput}
          />
        </div>
        <div className={classes.inputContainer}>
          <div className={classes.rangeInputText}>Range:</div>
          <TextField
            ref={(d) => { this._fromInput = d; }}
            // hintText="from"
            name="fromText"
            style={rangeInput}
            inputStyle={validStyle}
            underlineStyle={underlineStyle}
            type="number"
            step={step}
            defaultValue={this.stateValue.from}
            onChange={e => this.handleInput(e.target.value, 'from')}
            onKeyDown={e => this.setValidState(
              e.target.value,
              this.stateValue.to,
              'from'
            )}
          />
          <div className={`${classes.rangeInputText} ${classes.rangeInputTextDash}`}>
            -
          </div>
          <TextField
            ref={(d) => { this._toInput = d; }}
            // hintText="to"
            name="toText"
            style={rangeInput}
            inputStyle={validStyle}
            underlineStyle={underlineStyle}
            type="number"
            step={step}
            defaultValue={this.stateValue.to}
            onChange={e => this.handleInput(e.target.value, 'to')}
            onKeyDown={e => this.setValidState(
              this.stateValue.from,
              e.target.value,
              'to'
            )}
          />
        </div>
      </div>
    );
  }
}

FilterNum.propTypes = {
  name: React.PropTypes.string.isRequired,
  filterState: React.PropTypes.object.isRequired,
  sheet: React.PropTypes.object.isRequired,
  dist: React.PropTypes.object.isRequired,
  condDist: React.PropTypes.object.isRequired,
  handleChange: React.PropTypes.func.isRequired
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
    marginBottom: -14,
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
