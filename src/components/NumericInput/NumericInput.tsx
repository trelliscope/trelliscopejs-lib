import React, { useState } from 'react';
import type { SetStateAction } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import classNames from 'classnames';
import styles from './NumericInput.module.scss';

interface NumericInputProps {
  arrows?: boolean;
  value: number;
  size: number;
  min: number;
  max: number;
  step: number;
  onChange: (arg1: number) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({ arrows, value, size, min, max, step, onChange }) => {
  const [newValue, setNewValue] = useState<number>(value);

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

  const handleChange = (event: { target: { value: string | number | SetStateAction<number> } }) => {
    setNewValue(event.target.value as number);
    const val = parseFloat(event.target.value as string);
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

  useHotkeys('up', increment);
  useHotkeys('down', decrement);
  useHotkeys('left, right, g, l, s, f, c, a, i, o, r', (event) => event.stopPropagation());

  return (
    <span className={styles.numericInputSpan}>
      <input
        type="text"
        size={size ? size : 4} // eslint-disable-line no-unneeded-ternary
        className={classNames('mousetrap', styles.numericInputInput)}
        value={newValue}
        onChange={handleChange}
      />
      {arrows && (
        <span>
          <button type="button" key="up-button" className={styles.numericInputB} onClick={increment} tabIndex={-1}>
            <i className={styles.numericInputI} />
          </button>
          <button type="button" key="down-button" className={styles.numericInputB2} onClick={decrement} tabIndex={-1}>
            <i className={styles.numericInputI2} />
          </button>
        </span>
      )}
    </span>
  );
};

NumericInput.defaultProps = {
  arrows: false,
};

export default NumericInput;
