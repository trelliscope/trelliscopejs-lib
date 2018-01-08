import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Mousetrap from 'mousetrap';
import uiConsts from '../assets/styles/uiConsts';

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
    this.mousetrap = new Mousetrap(this._NumericInput);
    this.mousetrap.bind(['up'], () => this.increment());
    this.mousetrap.bind(['down'], () => this.decrement());
    this.mousetrap.bind(['esc'], () => {
      this._NumericInput.blur();
      return false;
    });
    this.mousetrap.bind(['left', 'right', 'g', 'l', 's', 'f', 'c', 'a', 'i', 'o', 'r'],
      event => event.stopPropagation());
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value });
  }
  componentWillUnmount() {
    this.mousetrap.unbind(['up']);
    this.mousetrap.unbind(['down']);
    this.mousetrap.unbind(['esc']);
    this.mousetrap.unbind(['left', 'right', 'g', 'l', 's', 'f', 'c', 'a', 'i', 'o', 'r']);
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
    const classes = this.props.classes;

    let arrowElements = '';
    if (this.props.arrows) {
      arrowElements = (
        <span>
          <button
            key="up-button"
            className={`${classes.b} ${classes.b1}`}
            onTouchTap={this.increment}
            tabIndex="-1"
          >
            <i className={`${classes.i} ${classes.i1}`} />
          </button>
          <button
            key="down-button"
            className={`${classes.b} ${classes.b2}`}
            onTouchTap={this.decrement}
            tabIndex="-1"
          >
            <i className={`${classes.i} ${classes.i2}`} />
          </button>
        </span>
      );
    }

    return (
      <span className={classes.span}>
        <input
          ref={(d) => { this._NumericInput = d; }}
          type="text"
          size={this.props.size ? this.props.size : 4}
          className={`mousetrap ${classes.input}`}
          value={this.state.value}
          onChange={this.handleChange}
        />
        {arrowElements}
      </span>
    );
  }
}

NumericInput.propTypes = {
  // sheet: PropTypes.object.isRequired,
  arrows: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

// ------ static styles ------

const staticStyles = {
  span: {
    position: 'relative',
    display: 'inline-block',
    borderRadius: 0,
    fontSize: 13
  },
  input: {
    padding: '3px 10px 3px 6px',
    boxSizing: 'border-box',
    height: 28,
    width: 'auto',
    // height: 28,
    fontSize: 15,
    borderRadius: 2,
    fontFamily: uiConsts.fontFamily,
    border: '1px solid rgb(204, 204, 204)',
    display: 'block',
    // -webkit-appearance: 'none',
    lineHeight: 'normal'
  },
  b: {
    position: 'absolute',
    right: 2,
    width: 15,
    borderColor: 'rgba(0, 0, 0, 0.0980392)',
    borderStyle: 'solid',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.1s',
    boxShadow: 'none',
    '&:hover': {
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
};

export default injectSheet(staticStyles)(NumericInput);
