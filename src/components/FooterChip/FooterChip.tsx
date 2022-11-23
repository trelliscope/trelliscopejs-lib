import React from 'react';
import { useDispatch } from 'react-redux';
import { setFilter, setFilterView } from '../../slices/filterSlice';
import { setSort } from '../../slices/sortSlice';
import { setLayout } from '../../slices/layoutSlice';
import styles from './FooterChip.module.scss';

interface FooterChipProps {
  label: string;
  icon: string;
  text: string;
  index: number;
  type: string;
}

const FooterChip: React.FC<FooterChipProps> = ({ label, icon, text, index, type }) => {
  const dispatch = useDispatch();

  const handleStateClose = (x: { type: string; index: number; label: string }) => {
    if (x.type === 'sort') {
      dispatch(setSort(x.index));
      dispatch(setLayout({ pageNum: 1 }));
    } else if (x.type === 'filter') {
      dispatch(setFilterView({ name: x.label, which: 'remove' }));
      dispatch(setFilter(x.label));
      dispatch(setLayout({ pageNum: 1 }));
    }
  };

  let iconTag;
  if (icon !== '') {
    iconTag = <i className={`${icon} ${styles.footerChipIndIcon}`} />;
  }
  let textTag;
  if (text !== '') {
    textTag = <span className={styles.footerChipText}>{`(${text})`}</span>;
  }

  return (
    <div className={styles.footerChipWrapper}>
      <span className={styles.footerChipLabel}>
        {iconTag}
        {label}
        {textTag}
      </span>
      <svg
        viewBox="0 0 24 24"
        className={styles.footerChipCloseIcon}
        key="icon"
        onClick={() => handleStateClose({ label, index, type })}
      >
        <path
          d={
            'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 ' +
            '13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 ' +
            '10.59 15.59 7 17 8.41 13.41 12 17 15.59z'
          }
        />
      </svg>
    </div>
  );
};

export default FooterChip;
