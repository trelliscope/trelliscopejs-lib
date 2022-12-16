import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

interface ErrorSnackInterface {
  errorMsg: string;
  handleClose: () => void;
}

const ErrorSnack: React.FC<ErrorSnackInterface> = ({errorMsg, handleClose}) => (
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

export default ErrorSnack;
