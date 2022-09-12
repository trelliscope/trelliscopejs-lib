import classNames from 'classnames';
import React from 'react';
import { SB_CONFIG } from '../../constants';
import styles from './SideButton.module.scss';

interface SideButtonProps {
  className?: string;
  active?: boolean;
  title: string;
  label: string;
  icon: string;
  onClick: () => void;
}

const SideButton: React.FC<SideButtonProps> = ({ className, active, icon, title, label, onClick }) => (
  <button
    type="button"
    className={classNames(styles.sideButton, className, {
      [styles.sideButton__active]: active,
      // What's this for?
      [styles.sideButton__bottom]: title === SB_CONFIG,
    })}
    onClick={onClick}
  >
    <div className={styles.sideButtonIcon}>
      <i className={icon} />
    </div>
    <div className={styles.sideButtonLabel}>{label}</div>
  </button>
);

SideButton.defaultProps = {
  className: '',
  active: false,
};

export default SideButton;
