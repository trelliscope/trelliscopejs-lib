import React from 'react';
import styles from './Panel.module.scss';

interface PanelGraphicProps {
  type: PanelType;
  src: string;
  alt: string;
  aspectRatio?: number;
  imageWidth: number | string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ type, src, alt, aspectRatio, imageWidth }) => (
  <div
    className={styles.panelGraphic}
    style={{
      width: imageWidth,
      height: `calc(${imageWidth} / ${(aspectRatio || 1)})`,
      aspectRatio: imageWidth === -1 ? (aspectRatio || 1) : 'unset'
    }}
  >
    {type === 'iframe' && (
      <iframe
        key={`${src}_${window.innerWidth}`}
        width="100%"
        height="100%"
        // scrolling="no"
        src={src}
        title={alt} 
      />
    )}
    {type === 'img' && (
      <img
        src={src}
        alt={alt}
      />)
    }
  </div>
);

PanelGraphic.defaultProps = {
  aspectRatio: undefined,
};

export default PanelGraphic;
