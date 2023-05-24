import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import PanelTable from '../PanelTable/PanelTable';
import { setLabels } from '../../slices/labelsSlice';
import PanelPicker from '../PanelPicker';
import styles from './Panel.module.scss';

interface PanelProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
  children: React.ReactNode;
  onClick: (meta: IPanelMeta, source: string) => void;
  primaryMeta: IPanelMeta;
  handlePanelChange: (value: string) => void;
  selectedValue: string;
}

const Panel: React.FC<PanelProps> = ({
  data,
  labels,
  inputs,
  children,
  onClick,
  primaryMeta,
  handlePanelChange,
  selectedValue,
}) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (data[primaryMeta.varname]) {
      onClick(primaryMeta, data[primaryMeta.varname] as string);
    }
  };

  const handleRemoveLabel = (label: string) => {
    const newLabels = labels.map((labelItem) => labelItem.varname).filter((labelItem) => labelItem !== label);
    const newInputs = inputs ? inputs.map((inputItem) => inputItem.name).filter((inputItem) => inputItem !== label) : [];
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
        <div className={styles.panelGraphicPickerContainer}>
          <PanelPicker handlePanelChange={handlePanelChange} selectedValue={selectedValue} />
        </div>
      </div>
      <PanelTable data={data} labels={labels} inputs={inputs} compact onLabelRemove={handleRemoveLabel} />
    </div>
  );
};

export default Panel;
