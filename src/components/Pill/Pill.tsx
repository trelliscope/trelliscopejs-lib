import React from 'react';
import classNames from 'classnames';
import styles from './Pill.module.scss';

interface PillProps {
  children: React.ReactNode;
  onClick?: () => void;
  activeFiltersArray: string[];
}

const Pill: React.FC<PillProps> = ({ children, onClick, activeFiltersArray }) => (
  <li className={styles.pill}>
    <button
      type="button"
      className={classNames(styles.pillButton, {
        [styles.pillButton__active]: activeFiltersArray.includes(children as string),
      })}
      onClick={onClick}
    >
      {children}
    </button>
  </li>
);

Pill.defaultProps = {
  onClick: () => {},
};

export default Pill;
