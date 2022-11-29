import React from 'react';
import styles from './FooterChip.module.scss';

interface FooterChipProps {
  label: string;
  text: string;
  index: number;
  type: string;
  handleClose: (x: { label: string; index: number; type: string }) => void;
}

const FooterChip: React.FC<FooterChipProps> = ({ label, text, index, type, handleClose }) => (
  <div className={styles.footerChipWrapper}>
    <span className={styles.footerChipLabel}>
      {label}
      {text !== '' && <span className={styles.footerChipText}>{`(${text})`}</span>}
    </span>
    <svg
      viewBox="0 0 24 24"
      className={styles.footerChipCloseIcon}
      key="icon"
      onClick={() => handleClose({ label, index, type })}
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

export default FooterChip;
