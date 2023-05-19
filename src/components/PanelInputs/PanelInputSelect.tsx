import React, { useRef, useState } from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ClickAwayListener,
  Popover,
  Tooltip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useStoredInputValue } from '../../inputUtils';
import styles from './PanelInputs.module.scss';

interface PanelInputSelectProps {
  name: string;
  options: string[];
  panelKey: string;
}

const PanelInputSelect: React.FC<PanelInputSelectProps> = ({ name, options, panelKey }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = useState(false);
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);

  const handleChange = (event: SelectChangeEvent) => {
    if (event.target.value === 'none') {
      setStoredValue(event.target.value);
      clearStoredValue();
      return;
    }
    setStoredValue(event.target.value);
  };

  const handleClickAway = () => {
    setInputOpen(false);
  };

  return (
    <div className={styles.panelInputText} ref={anchorRef}>
      <div className={styles.panelInputTextButtonContainer}>
        <Tooltip title={getStoredValue()} placement="left" arrow>
          <div className={styles.panelInputTextValue}>{getStoredValue() === 'none' ? '' : getStoredValue()}</div>
        </Tooltip>
        <button type="button" tabIndex={-1} className={styles.panelInputTextEditButton} onClick={() => setInputOpen(true)}>
          <FontAwesomeIcon icon={faPencil} />
        </button>
      </div>
      <Popover
        open={inputOpen}
        anchorEl={anchorRef.current}
        classes={{ paper: styles.panelInputTextPopover }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableEscapeKeyDown
      >
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={handleClickAway}>
          <FormControl size="medium">
            <InputLabel>{name}</InputLabel>
            <Select value={getStoredValue() || 'none'} label={name} onChange={handleChange}>
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ClickAwayListener>
      </Popover>
    </div>
  );
};

export default PanelInputSelect;
