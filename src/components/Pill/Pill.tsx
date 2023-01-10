import React from 'react';
import styles from './Pill.module.scss';

interface PillProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const Pill: React.FC<PillProps> = ({ children, onClick }) => (
  <li className={styles.pill}>
    <button type="button" className={styles.pillButton} onClick={onClick}>
      {children}
    </button>
  </li>
);

Pill.defaultProps = {
  onClick: () => {},
};

export default Pill;
