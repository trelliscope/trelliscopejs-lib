import React from 'react';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  type: PanelType;
  src: string;
  alt: string;
  ncol: number;
  aspectRatio?: number;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ type, src, alt, ncol, aspectRatio }) => (
  <div className={styles.panelGraphic} style={{ aspectRatio }}>
    {type === 'iframe' && <iframe key={`${ncol}_${window.innerWidth}`} width="100%" height="100%" scrolling="no" src={src} title={alt} />}
    {type === 'img' && <img style={{ objectFit: 'contain' }} src={src} alt={alt} />}
  </div>
);

PanelGraphic.defaultProps = {
  aspectRatio: undefined,
};

export default PanelGraphic;
