import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { setErrorMessage } from '../../slices/appSlice';
import { errorSelector } from '../../selectors';

const ErrorSnack: React.FC = () => {
  const dispatch = useDispatch();
  const errorMsg = useSelector(errorSelector);
  const handleClose = () => {
    dispatch(setErrorMessage(''));
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={errorMsg !== ''}
      onClose={handleClose}
      message={errorMsg}
      action={[
        <Button key="undo" color="secondary" size="small" onClick={handleClose}>
          Close
        </Button>,
      ]}
    />
  );
};

export default ErrorSnack;
