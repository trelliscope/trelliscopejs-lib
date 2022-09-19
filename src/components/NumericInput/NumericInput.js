import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Mousetrap from 'mousetrap';
import styles from './NumericInput.module.scss';

const NumericInput = ({ arrows, value, size, min, max, step, onChange }) => {
  const [newValue, setNewValue] = useState(value);

  const increment = () => {
    const newVal = value + step;
    setNewValue(newVal);
    if (!(max && newVal > max) && onChange) {
      onChange(newVal);
    }
  };

  const decrement = () => {
    const newVal = value - step;
    setNewValue(newVal);
    if (!(min && newVal < min) && onChange) {
      onChange(newVal);
    }
  };

  const handleChange = (event) => {
    setNewValue(event.target.value);
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

  useEffect(() => {
    const mousetrap = new Mousetrap();
    mousetrap.bind('up', () => increment());
    mousetrap.bind('down', () => decrement());
    mousetrap.bind('esc', () => {
      NumericInput.blur();
      return false;
    });
    mousetrap.bind(['left', 'right', 'g', 'l', 's', 'f', 'c', 'a', 'i', 'o', 'r'], (event) => event.stopPropagation());
    return () => {
      mousetrap.unbind('up');
      mousetrap.unbind('down');
      mousetrap.unbind('esc');
      mousetrap.unbind(['left', 'right', 'g', 'l', 's', 'f', 'c', 'a', 'i', 'o', 'r']);
    };
  }, []);

  let arrowElements = '';
  if (arrows) {
    arrowElements = (
      <span>
        <button type="button" key="up-button" className={styles.numericInputB} onClick={increment} tabIndex="-1">
          <i className={styles.numericInputI} />
        </button>
        <button type="button" key="down-button" className={styles.numericInputB2} onClick={decrement} tabIndex="-1">
          <i className={styles.numericInputI2} />
        </button>
      </span>
    );
  }

  return (
    <span className={styles.numericInputSpan}>
      <input
        type="text"
        size={size ? size : 4} // eslint-disable-line no-unneeded-ternary
        className={classNames('mousetrap', styles.numericInputInput)}
        value={newValue}
        onChange={handleChange}
      />
      {arrowElements}
    </span>
  );
};

export default NumericInput;
