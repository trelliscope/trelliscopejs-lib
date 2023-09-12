import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@mui/material';
import PanelLabels from '../PanelLabels/PanelLabels';
import { setLabels } from '../../slices/labelsSlice';
import PanelPicker from '../PanelPicker';
import styles from './Panel.module.scss';
import { useDisplayInfo } from '../../slices/displayInfoAPI';
import { META_TYPE_PANEL } from '../../constants';
import { selectLayout } from '../../slices/layoutSlice';

interface PanelProps {
  data: Datum;
  labels: IMeta[];
  inputs: IInput[];
  children: React.ReactNode;
  onClick: (meta: IPanelMeta, source: string, index: number) => void;
  primaryMeta: IPanelMeta;
  handlePanelChange: (value: string) => void;
  selectedValue: string;
  index: number;
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
  index,
}) => {
  const dispatch = useDispatch();
  const { data: displayInfo } = useDisplayInfo();
  const layout = useSelector(selectLayout);
  const showLabels = layout?.showLabels;
  const panelMetas =
    displayInfo?.metas.filter((meta: IMeta) => meta.type === META_TYPE_PANEL).map((meta) => meta.varname) || [];

  const handleClick = () => {
    if (data[primaryMeta.varname]) {
      onClick(primaryMeta, data[primaryMeta.varname] as string, index);
    }
  };

  const handleRemoveLabel = (label: string) => {
    const newLabels = labels.map((labelItem) => labelItem.varname).filter((labelItem) => labelItem !== label);
    const newInputs = inputs ? inputs.map((inputItem) => inputItem.name).filter((inputItem) => inputItem !== label) : [];
    const newLabelsWithInputs = [...newLabels, ...newInputs];
    dispatch(setLabels(newLabelsWithInputs));
  };

  return (
    <div id="panel-control" className={styles.panel}>
      <div role="presentation" className={styles.panelGraphic}>
        {children}
        <div className={styles.panelGraphicExpand}>
          <IconButton
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.5);',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.7);',
              },
            }}
            size="small"
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faExpand} />
          </IconButton>
        </div>
        {panelMetas?.length > 1 && (
          <div className={styles.panelGraphicPickerContainer}>
            <PanelPicker handlePanelChange={handlePanelChange} selectedValue={selectedValue} />
          </div>
        )}
      </div>
      {showLabels && <PanelLabels data={data} labels={labels} inputs={inputs} onLabelRemove={handleRemoveLabel} />}
    </div>
  );
};

export default Panel;
