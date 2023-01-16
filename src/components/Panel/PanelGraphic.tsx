import React from 'react';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  src: string;
  alt: string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ src, alt }) => {
  return (
    <div className={styles.panelGraphic}>
      <img src={src} alt="display" alt={alt} />
    </div>
  );
};

export default PanelGraphic;
