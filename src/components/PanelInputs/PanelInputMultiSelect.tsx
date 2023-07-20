import React, { useRef, useState } from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener, Popover, Tooltip, Autocomplete, TextField, Box } from '@mui/material';
import { useStoredInputValue } from '../../inputUtils';
import styles from './PanelInputs.module.scss';

interface PanelInputMultiSelectProps {
  name: string;
  options: string[];
  panelKey: string;
}

const PanelInputMultiSelect: React.FC<PanelInputMultiSelectProps> = ({ name, options, panelKey }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = useState(false);
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);

  const handleChange = (value: string[]) => {
    if (value.length === 0) {
      setStoredValue('');
      clearStoredValue();
      return;
    }
    setStoredValue(JSON.stringify(value));
  };

  const handleClickAway = () => {
    setInputOpen(false);
  };

  return (
    <div className={styles.panelInputText}>
      <div className={styles.panelInputTextButtonContainer}>
        <Tooltip title={JSON.parse(getStoredValue() || '[]').join(', ')} placement="left" arrow>
          <div className={styles.panelInputTextValue}>{JSON.parse(getStoredValue() || '[]').join(', ')}</div>
        </Tooltip>
        <button type="button" tabIndex={-1} className={styles.panelInputTextEditButton} onClick={() => setInputOpen(true)}>
          <span ref={anchorRef}>
            <FontAwesomeIcon icon={faPencil} />
          </span>
        </button>
      </div>
      <Popover
        open={inputOpen}
        anchorEl={anchorRef.current}
        classes={{ paper: styles.panelInputTextPopover }}
        sx={{ left: '20px' }}
        disableEscapeKeyDown
      >
        <ClickAwayListener mouseEvent="onMouseUp" onClickAway={handleClickAway}>
          <Box sx={{ width: '500px' }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={options}
              onChange={(e, value) => handleChange(value)}
              value={JSON.parse(getStoredValue() || '[]')}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label={name} placeholder="Select an option" />
              )}
            />
          </Box>
        </ClickAwayListener>
      </Popover>
    </div>
  );
};

export default PanelInputMultiSelect;
