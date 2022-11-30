import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faFilter, faSort, faEye, faGrip } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { SB_CONFIG } from '../../constants';
import styles from './SideButton.module.scss';

interface SideButtonProps {
  className?: string;
  active?: boolean;
  title: string;
  label: string;
  onClick: () => void;
}

const SideButton: React.FC<SideButtonProps> = ({ className, active, title, label, onClick }) => (
  <button
    type="button"
    className={classNames(styles.sideButton, className, {
      [styles.sideButton__active]: active,
      // What's this for?
      [styles.sideButton__bottom]: title === SB_CONFIG,
    })}
    onClick={onClick}
  >
    <div className={styles.sideButtonTest}>
      <div className={styles.sideButtonIcon}>
        {label === 'Grid' && <FontAwesomeIcon icon={faGrip} />}
        {label === 'Labels' && <FontAwesomeIcon icon={faTags} />}
        {label === 'Filter' && <FontAwesomeIcon icon={faFilter} />}
        {label === 'Sort' && <FontAwesomeIcon icon={faSort} />}
        {label === 'Views' && <FontAwesomeIcon icon={faEye} />}
      </div>
      <div className={styles.sideButtonLabel}>{label}</div>
    </div>
  </button>
);

SideButton.defaultProps = {
  className: '',
  active: false,
};

export default SideButton;
