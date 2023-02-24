import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './Panel.module.scss';
import PanelTable from '../PanelTable/PanelTable';
import { setLabels } from '../../slices/labelsSlice';

interface PanelProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
  children: React.ReactNode;
  onClick: (PANEL_KEY: string | number) => void;
}

const Panel: React.FC<PanelProps> = ({ data, labels, inputs, children, onClick }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    if (data.__PANEL_KEY__) {
      onClick(data.__PANEL_KEY__);
    }
  };

  const handleRemoveLabel = (label: string) => {
    const newLabels = labels.map((labelItem) => labelItem.varname).filter((labelItem) => labelItem !== label);
    dispatch(setLabels(newLabels));
  };

  return (
    <div className={styles.panel}>
      <div role="presentation" className={styles.panelGraphicWrapper} onClick={handleClick}>
        {children}
      </div>
      <PanelTable data={data} labels={labels} inputs={inputs} compact onLabelRemove={handleRemoveLabel} />
    </div>
  );
};

export default Panel;
