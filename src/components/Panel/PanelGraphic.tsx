import React from 'react';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  type: PanelType;
  src: string;
  alt: string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ type, src, alt }) => (
  <div className={styles.panelGraphic}>
    {type === 'iframe' && <iframe width="100%" height="100%" scrolling="no" src={src} title={alt} />}
    {type === 'img' && <img src={src} alt={alt} />}
  </div>
);

export default PanelGraphic;
