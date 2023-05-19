import React from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener, Popover, TextField, Tooltip } from '@mui/material';
import styles from './PanelInputs.module.scss';
import { useStoredInputValue } from '../../inputUtils';

interface PanelInputTextProps {
  name: string;
  rows?: number;
  panelKey: string;
  isNumeric?: boolean;
  input: ITextInput | INumberInput;
}

const PanelInputText: React.FC<PanelInputTextProps> = ({ name, rows, panelKey, isNumeric, input }) => {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState<string | undefined>(undefined);
  const { getStoredValue, setStoredValue, clearStoredValue } = useStoredInputValue(panelKey, name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = isNumeric ? inputValue.replace(/\D/g, '') : inputValue;

    if (isNumeric) {
      const numericValueAsNumber = parseInt(numericValue, 10);
      if ('max' in input && input.max && numericValueAsNumber > input.max) {
        setTextInputValue('');
        return;
      }
      if ('min' in input && input.min && numericValueAsNumber < input.min) {
        setTextInputValue('');
        return;
      }
    }

    setTextInputValue(numericValue);
  };

  const handleClickAway = () => {
    setInputOpen(false);
    setTextInputValue('');
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
        TransitionProps={{
          onEntered: () => {
            setTextInputValue(getStoredValue() || '');
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableEscapeKeyDown
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            if (textInputValue) {
              setStoredValue(textInputValue);
              setInputOpen(false);
            }
            if (!textInputValue) {
              setStoredValue('');
              clearStoredValue();
            }
            setInputOpen(false);
          }
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            id="outlined-multiline-static"
            classes={{ root: styles.panelInputTextField }}
            label={`${name} ('shift+enter' to save) ${isNumeric && 'min' in input && input.min ? `min: ${input.min}` : ''} ${
              isNumeric && 'max' in input && input.max ? `max: ${input.max}` : ''
            } `}
            onChange={handleChange}
            value={textInputValue}
            style={{ minWidth: 300 }}
            size="small"
            autoFocus
            multiline
            rows={rows}
            variant="outlined"
          />
        </ClickAwayListener>
      </Popover>
    </div>
  );
};

PanelInputText.defaultProps = {
  rows: 1,
  isNumeric: false,
};

export default PanelInputText;
