import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import styles from './NumericInput.module.scss';

class NumericInput extends React.Component {
  constructor(props) {
    super(props);
    let step = 1;
    if (props.step) {
      step = props.step; // eslint-disable-line prefer-destructuring
    }
    this.state = { value: props.value, step };
    this.mousetrap = null;
  }

  componentDidMount() {
    this.mousetrap = new Mousetrap(this._NumericInput);
    this.mousetrap.bind('up', () => this.increment());
    this.mousetrap.bind('down', () => this.decrement());
    this.mousetrap.bind('esc', () => {
      this._NumericInput.blur();
      return false;
    });
    this.mousetrap.bind(['left', 'right', 'g', 'l', 's', 'f', 'c', 'a', 'i', 'o', 'r'], (event) => event.stopPropagation());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // eslint-disable-line camelcase
    this.setState({ value: nextProps.value });
  }

  componentWillUnmount() {
    this.mousetrap.unbind('up');
    this.mousetrap.unbind('down');
    this.mousetrap.unbind('esc');
    this.mousetrap.unbind(['left', 'right', 'g', 'l', 's', 'f', 'c', 'a', 'i', 'o', 'r']);
  }

  increment = () => {
    const { value, step } = this.state;
    const { max, onChange } = this.props;
    const newVal = value + step;
    if (!(max && newVal > max)) {
      this.setState({ value: newVal });
      if (onChange) {
        onChange(newVal);
      }
    }
  };

  decrement = () => {
    const { value, step } = this.state;
    const { min, onChange } = this.props;
    const newVal = value - step;
    if (!(min && newVal < min)) {
      this.setState({ value: newVal });
      if (onChange) {
        onChange(newVal);
      }
    }
  };

  handleChange = (event) => {
    const { min, max, onChange } = this.props;
    this.setState({ value: event.target.value });
    const val = parseFloat(event.target.value);
    if (!Number.isNaN(val) && onChange) {
      let updateable = true;
      if (min && val < min) {
        updateable = false;
      }
      if (max && val > max) {
        updateable = false;
      }
      if (updateable) {
        onChange(val);
      }
    }
  };

  render() {
    const { arrows, size } = this.props;
    const { value } = this.state;

    let arrowElements = '';
    if (arrows) {
      arrowElements = (
        <span>
          <button
            type="button"
            key="up-button"
            className={styles.numericInputB}
            onClick={this.increment}
            tabIndex="-1"
          >
            <i className={styles.numericInputI} />
          </button>
          <button
            type="button"
            key="down-button"
            className={styles.numericInputB2}
            onClick={this.decrement}
            tabIndex="-1"
          >
            <i className={styles.numericInputI2} />
          </button>
        </span>
      );
    }

    return (
      <span className={styles.numericInputSpan}>
        <input
          ref={(d) => {
            this._NumericInput = d;
          }}
          type="text"
          size={size ? size : 4} // eslint-disable-line no-unneeded-ternary
          className={classNames('mousetrap', styles.numericInputInput)}
          value={value}
          onChange={this.handleChange}
        />
        {arrowElements}
      </span>
    );
  }
}

NumericInput.propTypes = {
  arrows: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default NumericInput;
