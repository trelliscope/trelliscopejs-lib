import React from 'react';
import type { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { setErrorMessage } from '../../slices/appSlice';
import { RootState } from '../../store';

interface ErrorSnackProps {
  errorMsg: string;
  handleClose: () => void;
}

const ErrorSnack: React.FC<ErrorSnackProps> = ({ errorMsg, handleClose }) => (
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

// ------ redux container ------

const errorSelector = (state: RootState) => state.app.errorMsg;

const stateSelector = createSelector(errorSelector, (errorMsg) => ({
  errorMsg,
}));

const mapStateToProps = (state: RootState) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleClose: () => {
    dispatch(setErrorMessage(''));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorSnack);
