import React, { useRef, useState } from 'react';
import { faPencil, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener, InputAdornment, Popover, TextField, Tooltip } from '@mui/material';
import styles from './PanelInputs.module.scss';
import { useStoredInputValue } from '../../inputUtils';

interface PanelInputTextProps {
  name: string;
  rows?: number;
  panelKey: string;
  isNumeric?: boolean;
  input: ITextInput | INumberInput;
  iconFontSize?: number;
}

const PanelInputText: React.FC<PanelInputTextProps> = ({ name, rows, panelKey, isNumeric, input, iconFontSize }) => {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState<string | undefined>(undefined);
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (value: string) => {
    if (!value) {
      setStoredValue('');
      clearStoredValue();
      return;
    }
    setStoredValue(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = isNumeric ? inputValue.replace(/[^\d-]|-(?=[^-]*-)/g, '') : inputValue;
    if (isNumeric) {
      const numericValueAsNumber = parseInt(numericValue, 10);
      if ('max' in input && input.max !== null && numericValueAsNumber > input.max) {
        setTextInputValue('');
        return;
      }
      if ('min' in input && input.min !== null && numericValueAsNumber < input.min) {
        setTextInputValue('');
        return;
      }
    }
    setTextInputValue(numericValue);
    setIsSaving(true);

    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    autoSaveTimer.current = setTimeout(() => {
      handleSave(numericValue);
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
        setIsSaving(false);
      }
    }, 1000);
  };

  const handleClickAway = () => {
    setInputOpen(false);
    setTextInputValue('');
  };

  return (
    <div className={styles.panelInputText}>
      <div className={styles.panelInputTextButtonContainer}>
        <Tooltip title={getStoredValue()} placement="left" arrow>
          <div className={styles.panelInputTextValue}>{getStoredValue()}</div>
        </Tooltip>
        <button
          type="button"
          tabIndex={-1}
          className={styles.panelInputTextEditButton}
          onClick={() => setInputOpen(true)}
          style={{ lineHeight: `${(iconFontSize || 12) * 1.5}px` }}
        >
          <span ref={anchorRef}>
            <FontAwesomeIcon icon={faPencil} style={{ fontSize: iconFontSize }} />
          </span>
        </button>
      </div>
      <Popover
        open={inputOpen}
        anchorEl={anchorRef.current}
        classes={{ paper: styles.panelInputTextPopover }}
        TransitionProps={{
          onEntered: () => {
            setTextInputValue(getStoredValue() || '');
          },
        }}
        sx={{ left: '20px' }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            if (autoSaveTimer.current) {
              clearTimeout(autoSaveTimer.current);
              setIsSaving(false);
            }
            handleSave(textInputValue as string);
            setInputOpen(false);
          }
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            id="outlined-multiline-static"
            classes={{ root: styles.panelInputTextField }}
            label={`${name} ('esc' to close) ${
              isNumeric && 'min' in input && input.min !== null ? `min: ${input.min}` : ''
            } ${isNumeric && 'max' in input && input.max !== null ? `max: ${input.max}` : ''} `}
            onChange={handleChange}
            value={textInputValue}
            style={{ minWidth: 300 }}
            size="small"
            autoFocus
            multiline
            rows={rows}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon color="green" icon={faCheck} />}
                </InputAdornment>
              ),
            }}
          />
        </ClickAwayListener>
      </Popover>
    </div>
  );
};

PanelInputText.defaultProps = {
  rows: 1,
  isNumeric: false,
  iconFontSize: 12,
};

export default PanelInputText;
