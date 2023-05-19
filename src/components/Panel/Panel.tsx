import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import PanelTable from '../PanelTable/PanelTable';
import { setLabels } from '../../slices/labelsSlice';
import styles from './Panel.module.scss';

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
    const newInputs = inputs? inputs.map((inputItem) => inputItem.name).filter((inputItem) => inputItem !== label) : [];
    const newLabelsWithInputs = [...newLabels, ...newInputs];
    dispatch(setLabels(newLabelsWithInputs));
  };

  return (
    <div className={styles.panel}>
      <div role="presentation" className={styles.panelGraphic}>
        {children}
        <div className={styles.panelGraphicExpand}>
          <IconButton size="small" onClick={handleClick}>
            <FontAwesomeIcon icon={faExpand} />
          </IconButton>
        </div>
      </div>
      <PanelTable data={data} labels={labels} inputs={inputs} compact onLabelRemove={handleRemoveLabel} />
    </div>
  );
};

export default Panel;
