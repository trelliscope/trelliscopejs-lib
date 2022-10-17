import React from 'react';
import HTMLWidget from '../HTMLWidget';
import styles from './PanelGraphic.module.scss';

interface PanelGraphicProps {
  name: string;
  type: string;
  data: PanelData;
  imgSrcLookup?: string;
  width: number;
  height: number;
  panelKey?: string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ name, type, data, imgSrcLookup, width, height, panelKey }) => (
  <div className={styles.panelGraphic}>
    {type === 'image' && <img src={data as string} alt="panel" style={{ width, height }} />}
    {type === 'image_src' && (
      <img src={imgSrcLookup} alt="panel" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    )}
    {type === 'htmlwidget' && panelKey && (
      <HTMLWidget name={name} data={data as HTMLWidgetData} widgetKey={panelKey} width={width} height={height} />
    )}
  </div>
);

PanelGraphic.defaultProps = {
  panelKey: '',
  imgSrcLookup: '',
};

export default PanelGraphic;
