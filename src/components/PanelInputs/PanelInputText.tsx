import React from 'react';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClickAwayListener, Popover, TextField } from '@mui/material';
import styles from './PanelInputs.module.scss';
import { useStoredInputValue } from '../../inputUtils';

interface PanelInputTextProps {
  name: string;
  rows?: number;
  panelKey: string;
}

const PanelInputText: React.FC<PanelInputTextProps> = ({ name, rows, panelKey }) => {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [inputOpen, setInputOpen] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState<string | undefined>(undefined);
  const { getStoredValue, setStoredValue } = useStoredInputValue(panelKey, name);

  const handleClickAway = () => {
    setInputOpen(false);
    setTextInputValue('');
  };

  return (
    <div className={styles.panelInputText} ref={anchorRef}>
      <div className={styles.panelInputTextButton}>
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
            }
            setInputOpen(false);
          }
        }}
      >
        <ClickAwayListener onClickAway={handleClickAway}>
          <TextField
            id="outlined-multiline-static"
            classes={{ root: styles.panelInputTextField }}
            label={`${name} ('shift+enter' to save)`}
            onChange={(e) => {
              setTextInputValue(e.target.value);
            }}
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
};

export default PanelInputText;
