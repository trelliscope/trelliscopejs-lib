import React from 'react';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  src: string;
  alt: string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ src, alt }) => (
  <div className={styles.panelGraphic}>
    <img src={`${process.env.PUBLIC_URL}${src}`} alt={alt} />
  </div>
);

export default PanelGraphic;
