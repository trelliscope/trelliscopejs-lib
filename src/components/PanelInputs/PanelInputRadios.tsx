import React from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useStoredInputValue } from '../../inputUtils';
import styles from './PanelInputs.module.scss';

interface PanelInputRadiosProps {
  name: string;
  options: string[];
  panelKey: string;
}

const PanelInputRadios: React.FC<PanelInputRadiosProps> = ({ name, options, panelKey }) => {
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);

  return (
    <RadioGroup
      classes={{ root: styles.panelInputRadioGroup }}
      name={name}
      value={getStoredValue() || ''}
      onChange={(e) => {
        setStoredValue(e.target.value);
      }}
      onClick={() => {
        if (getStoredValue()) {
          setStoredValue('');
          clearStoredValue();
        }
      }}
    >
      {options.map((option) => (
        <FormControlLabel
          classes={{ label: styles.panelInputRadioGroupLabel }}
          key={option}
          value={option}
          control={<Radio classes={{ root: styles.panelInputRadioGroupRadio }} disableRipple size="small" />}
          label={option}
        />
      ))}
    </RadioGroup>
  );
};

export default PanelInputRadios;
