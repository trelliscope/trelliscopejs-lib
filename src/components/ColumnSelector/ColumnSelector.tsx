import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { selectLayout, setLayout } from '../../slices/layoutSlice';
import styles from './ColumnSelector.module.scss';
import ErrorWrapper from '../ErrorWrapper';

const ColumnSelector: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(selectLayout);
  const theme = useTheme();

  const handleColumnChange = (value: string) => {
    let nonZeroValue = value;
    if (value.charAt(0) === '0') {
      nonZeroValue = value.slice(1);
    }
    const num = parseInt(nonZeroValue || '1', 10);
    if (num > 15 || num < 0) return;
    dispatch(setLayout({ ncol: num }));
  };

  return (
    <ErrorWrapper>
      <div>
        <span style={{ color: theme.palette.text.primary }} className={styles.columnSelectorText}>
          Columns:
        </span>
      </div>
      <TextField
        sx={{
          maxWidth: 50,
          minWidth: 30,
          pt: 0,
          '& .MuiInput-root::before': {
            borderColor: theme.palette.secondary.dark,
          },
          '& .MuiInput-root:hover::before': {
            borderColor: theme.palette.primary.contrastText,
          },
        }}
        data-testid="column-selector"
        variant="standard"
        type="number"
        size="small"
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          style: { marginBottom: -4, textAlign: 'center' },
          'data-testid': 'column-selector-input',
        }}
        value={layout.ncol || 1}
        onChange={(e) => handleColumnChange(e.target.value)}
      />
    </ErrorWrapper>
  );
};

export default ColumnSelector;
