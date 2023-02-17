import React from 'react';
import styles from './Panel.module.scss';
import PanelTable from './PanelTable';

interface PanelProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ data, labels, inputs, children }) => (
  <div className={styles.panel}>
    <div className={styles.panelGraphic}>{children}</div>
    <PanelTable data={data} labels={labels} inputs={inputs} />
  </div>
);

export default Panel;
