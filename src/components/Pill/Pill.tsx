import React from 'react';
import classNames from 'classnames';
import styles from './Pill.module.scss';

interface PillProps {
  children: React.ReactNode;
  onClick?: () => void;
  curFiltersArr: string[];
}

const Pill: React.FC<PillProps> = ({ children, onClick, curFiltersArr }) => (
  <li className={styles.pill}>
    <button
      type="button"
      className={classNames(styles.pillButton, {
        [styles.pillButton__active]: curFiltersArr.includes(children as string),
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
