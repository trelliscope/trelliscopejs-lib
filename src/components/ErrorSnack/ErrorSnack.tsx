import React from 'react';
import type { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { setErrorMessage } from '../../actions';

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

const errorSelector = (state: { errorMsg: string }) => state.errorMsg;

const stateSelector = createSelector(errorSelector, (errorMsg) => ({
  errorMsg,
}));

const mapStateToProps = (state: { errorMsg: string }) => stateSelector(state);

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  handleClose: () => {
    dispatch(setErrorMessage(''));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorSnack);
