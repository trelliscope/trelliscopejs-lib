import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import Radium from 'radium';
import { uiConstsSelector } from '../selectors';

class NumericInput extends React.Component {
  constructor(props) {
    super(props);
    let step = 1;
    if (props.step) {
      step = props.step;
    }
    this.state = { value: props.value, step };
    this.mousetrap = null;
  }
  componentDidMount() {
    this.mousetrap = new Mousetrap(ReactDOM.findDOMNode(this));
    this.mousetrap.bind(['up'], () => this.increment());
    this.mousetrap.bind(['down'], () => this.decrement());
    this.mousetrap.bind(['esc'], () => {
      ReactDOM.findDOMNode(this.refs.numericinput).blur();
      return false;
    });
    this.mousetrap.bind(['left', 'right', 'g', 'l', 's', 'f', 'c'],
      (event) => event.stopPropagation());
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }
  componentWillUnmount() {
    this.mousetrap.unbind(['up']);
    this.mousetrap.unbind(['down']);
    this.mousetrap.unbind(['esc']);
    this.mousetrap.unbind(['left', 'right', 'g', 'l', 's', 'f', 'c']);
  }
  increment = () => {
    const newVal = this.state.value + this.state.step;
    if (!(this.props.max && newVal > this.props.max)) {
      this.setState({ value: newVal });
      if (this.props.onChange) {
        this.props.onChange(newVal);
      }
    }
  }
  decrement = () => {
    const newVal = this.state.value - this.state.step;
    if (!(this.props.min && newVal < this.props.min)) {
      this.setState({ value: newVal });
      if (this.props.onChange) {
        this.props.onChange(newVal);
      }
    }
  }
  handleChange = (event) => {
    this.setState({ value: event.target.value });
    const val = parseFloat(event.target.value);
    if (!isNaN(val) && this.props.onChange) {
      let updateable = true;
      if (this.props.min && val < this.props.min) {
        updateable = false;
      }
      if (this.props.max && val > this.props.max) {
        updateable = false;
      }
      if (updateable) {
        this.props.onChange(val);
      }
    }
  }
  render() {
    let arrowElements = '';
    if (this.props.arrows) {
      arrowElements = (
        <span>
          <b
            key="up-button"
            style={[this.props.style.b, this.props.style.b1]}
            onClick={this.increment}
          >
            <i style={[this.props.style.i, this.props.style.i1]}>
            </i>
          </b>
          <b
            key="down-button"
            style={[this.props.style.b, this.props.style.b2]}
            onClick={this.decrement}
          >
            <i style={[this.props.style.i, this.props.style.i2]}>
            </i>
          </b>
        </span>
      );
    }

    return (
      <span style={this.props.style.span}>
        <input
          ref="numericinput"
          className="mousetrap"
          type="text"
          size={this.props.size ? this.props.size : 5}
          style={this.props.style.input}
          value={this.state.value}
          onChange={this.handleChange}
        />
        {arrowElements}
      </span>
    );
  }
}

NumericInput.propTypes = {
  style: React.PropTypes.object,
  arrows: React.PropTypes.bool,
  value: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  size: React.PropTypes.number,
  onChange: React.PropTypes.func
};

// ------ redux container ------

const styleSelector = createSelector(
  uiConstsSelector,
  (ui) => ({
    style: {
      span: {
        position: 'relative',
        display: 'inline-block',
        borderRadius: 0,
        fontSize: 13
      },
      input: {
        padding: '10px 10px 10px 4px',
        boxSizing: 'border-box',
        height: 28,
        fontSize: 15,
        borderRadius: 2,
        fontFamily: ui.fontFamily,
        border: '1px solid rgb(204, 204, 204)',
        display: 'block',
        // -webkit-appearance: 'none',
        lineHeight: 'normal'
      },
      b: {
        position: 'absolute',
        right: 2,
        width: '2.26ex',
        borderColor: 'rgba(0, 0, 0, 0.0980392)',
        borderStyle: 'solid',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.1s',
        boxShadow: 'none',
        ':hover': {
          background: 'rgba(0, 0, 0, 0.2)',
          boxShadow: '0 0 0 0.5px rgba(0, 0, 0, 0.3)'
        }
      },
      b1: {
        top: 2,
        bottom: '50%',
        borderRadius: '2px 2px 0px 0px',
        borderWidth: '1px 1px 0px',
        background: 'rgba(0, 0, 0, 0.0980392)'
      },
      b2: {
        top: '50%',
        bottom: 2,
        borderRadius: '0px 0px 2px 2px',
        borderWidth: '0px 1px 1px',
        background: 'rgba(0, 0, 0, 0.0980392)'
      },
      i: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0
      },
      i1: {
        borderWidth: '0px 0.6ex 0.6ex',
        borderColor: 'transparent transparent rgba(0, 0, 0, 0.701961)',
        borderStyle: 'solid',
        margin: '-0.3ex 0px 0px -0.56ex'
      },
      i2: {
        borderWidth: '0.6ex 0.6ex 0px',
        borderColor: 'rgba(0, 0, 0, 0.701961) transparent transparent',
        borderStyle: 'solid',
        margin: '-0.3ex 0px 0px -0.56ex'
      }
    }
  })
);

const mapStateToProps = (state) => (
  styleSelector(state)
);

export default connect(
  mapStateToProps
)(Radium(NumericInput));
