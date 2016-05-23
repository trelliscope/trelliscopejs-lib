import React from 'react';
import Radium from 'radium';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';

class FilterNum extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = debounce(400, this.handleInput);
  }
  handleInput(val, which) {
    let newState = {};
    const newVal = val === '' ? undefined : val;
    const lower = which === 'from' ? newVal : this.props.filterState.value.from;
    const upper = which === 'to' ? newVal : this.props.filterState.value.to;
    newState = {
      name: this.props.filterState.name,
      type: 'range',
      value: {
        from: lower,
        to: upper
      },
      valid: true
    };
    this.props.handleChange(newState);
  }
  render() {
    return (
      <div style={this.props.style.container}>
        <div
          style={this.props.style.plotContainer}
        >
        </div>
        <div style={this.props.style.inputContainer}>
          <span style={this.props.style.rangeInputText}>Range: </span>
          <TextField
            hintText="from"
            style={this.props.style.rangeInput}
            desktop
            defaultValue={this.props.filterState.value.from}
            onChange={(e) => this.handleInput(e.target.value, 'from')}
          />
          <span style={this.props.style.rangeInputText}> - </span>
          <TextField
            hintText="to"
            style={this.props.style.rangeInput}
            desktop
            defaultValue={this.props.filterState.value.to}
            onChange={(e) => this.handleInput(e.target.value, 'to')}
          />
        </div>
      </div>
    );
  }
}

FilterNum.propTypes = {
  filterState: React.PropTypes.object,
  style: React.PropTypes.object,
  handleChange: React.PropTypes.func
};

export default Radium(FilterNum);
