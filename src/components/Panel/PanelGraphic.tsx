import React from 'react';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  type: PanelType;
  src: string;
  alt: string;
  aspectRatio?: number;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ type, src, alt, aspectRatio }) => (
  <div className={styles.panelGraphic} style={{ aspectRatio }}>
    {type === 'iframe' && <iframe width="100%" height="100%" scrolling="no" src={src} title={alt} />}
    {type === 'img' && <img src={src} alt={alt} />}
  </div>
);

PanelGraphic.defaultProps = {
  aspectRatio: undefined,
};

export default PanelGraphic;
