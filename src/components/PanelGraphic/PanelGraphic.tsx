import React from 'react';
import HTMLWidget from '../HTMLWidget';
import styles from './PanelGraphic.module.scss';

interface PanelGraphicProps {
  name: string;
  type: string;
  data: any;
  width: number;
  height: number;
  panelKey?: string;
}

const PanelGraphic: React.FC<PanelGraphicProps> = ({ name, type, data, width, height, panelKey }) => {
  console.log(width, height);

  return (
    <div className={styles.panelGraphic}>
      {type === 'image' && <img src={data} alt="panel" style={{ width, height }} />}
      {type === 'image_src' && (
        <img src={data} alt="panel" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      )}
      {type === 'htmlwidget' && panelKey && (
        <HTMLWidget name={name} data={data} widgetKey={panelKey} width={width} height={height} />
      )}
    </div>
  );
};

PanelGraphic.defaultProps = {
  panelKey: '',
};

export default PanelGraphic;
