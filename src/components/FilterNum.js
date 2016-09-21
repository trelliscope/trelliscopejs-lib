import React from 'react';
import Radium from 'radium';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';
import FilterNumPlot from './FilterNumPlot';

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
    const validStyle = { textAlign: 'center' };
    if (this.props.filterState.valid !== undefined && !this.props.filterState.valid) {
      validStyle.color = 'red';
    }
    this.stateValue = this.props.filterState.value;
    if (this.stateValue === undefined) {
      this.stateValue = {};
    }

    return (
      <div style={this.props.style.container}>
        <div
          style={this.props.style.plotContainer}
        >
          <FilterNumPlot
            name={this.props.name}
            style={this.props.style.plotContainer}
            dist={this.props.dist}
            condDist={this.props.condDist}
            filterState={this.props.filterState}
            handleChange={this.handleBrushInput}
          />
        </div>
        <div style={this.props.style.inputContainer}>
          <div style={this.props.style.rangeInputText}>Range:</div>
          <TextField
            ref={(d) => { this._fromInput = d; }}
            // hintText="from"
            name="fromText"
            style={this.props.style.rangeInput}
            inputStyle={validStyle}
            underlineStyle={this.props.style.underlineStyle}
            type="number"
            defaultValue={this.stateValue.from}
            onChange={e => this.handleInput(e.target.value, 'from')}
            onKeyDown={e => this.setValidState(
              e.target.value,
              this.stateValue.to,
              'from'
            )}
          />
          <div style={this.props.style.rangeInputText}>&ndash;</div>
          <TextField
            ref={(d) => { this._toInput = d; }}
            // hintText="to"
            name="toText"
            style={this.props.style.rangeInput}
            inputStyle={validStyle}
            underlineStyle={this.props.style.underlineStyle}
            type="number"
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
  name: React.PropTypes.string,
  filterState: React.PropTypes.object,
  style: React.PropTypes.object,
  dist: React.PropTypes.object,
  condDist: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

export default Radium(FilterNum);
