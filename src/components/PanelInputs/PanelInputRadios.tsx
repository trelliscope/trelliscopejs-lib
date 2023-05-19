import React, { useRef, useState } from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RadioGroup, FormControlLabel, Radio, ClickAwayListener, Popover, Tooltip } from '@mui/material';
import { useStoredInputValue } from '../../inputUtils';
import styles from './PanelInputs.module.scss';

interface PanelInputRadiosProps {
  name: string;
  options: string[];
  panelKey: string;
}

const PanelInputRadios: React.FC<PanelInputRadiosProps> = ({ name, options, panelKey }) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = useState(false);
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);

  const handleClickAway = () => {
    setInputOpen(false);
  };

  return (
    <div className={styles.panelInputText} ref={anchorRef}>
      <div className={styles.panelInputTextButtonContainer}>
        <Tooltip title={getStoredValue()} placement="left" arrow>
          <div className={styles.panelInputTextValue}>{getStoredValue()}</div>
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
        <ClickAwayListener onClickAway={handleClickAway}>
          <RadioGroup
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
        </ClickAwayListener>
      </Popover>
    </div>
  );
};

export default PanelInputRadios;
