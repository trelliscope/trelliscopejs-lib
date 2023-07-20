import React, { useRef, useState } from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, ClickAwayListener, FormControlLabel, FormGroup, Popover, TextField, Tooltip } from '@mui/material';
import styles from './PanelInputs.module.scss';
import { useStoredInputValue } from '../../inputUtils';

interface PanelInputCheckboxProps {
  name: string;
  panelKey: string;
  options: string[];
}

const PanelInputCheckbox: React.FC<PanelInputCheckboxProps> = ({ name, panelKey, options }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = useState(false);
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);

  const handleClickAway = () => {
    setInputOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCheckboxChange = (event: any) => {
    const stored = JSON.parse(getStoredValue() || '[]');
    if (event.target.checked) {
      setStoredValue(JSON.stringify([...stored, event.target.name]));
      return;
    }
    const newArr = stored.filter((item: string) => item !== event.target.name);
    setStoredValue(JSON.stringify(newArr));
    if (newArr.length === 0) {
      clearStoredValue();
    }
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
        <ClickAwayListener onClickAway={handleClickAway}>
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={<Checkbox checked={JSON.parse(getStoredValue() || '[]').includes(option)} />}
                name={option}
                label={option}
                onChange={handleCheckboxChange}
              />
            ))}
          </FormGroup>
        </ClickAwayListener>
      </Popover>
    </div>
  );
};

export default PanelInputCheckbox;
