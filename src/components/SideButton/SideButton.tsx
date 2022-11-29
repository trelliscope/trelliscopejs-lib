import React from 'react';
import AppsIcon from '@mui/icons-material/Apps';
import ListIcon from '@mui/icons-material/List';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
        {label === 'Grid' && <AppsIcon fontSize="large" />}
        {label === 'Labels' && <ListIcon fontSize="large" />}
        {label === 'Filter' && <FilterAltIcon fontSize="large" />}
        {label === 'Sort' && <SortIcon fontSize="large" />}
        {label === 'Views' && <VisibilityIcon fontSize="large" />}
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
