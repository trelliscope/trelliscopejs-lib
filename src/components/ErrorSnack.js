import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

import { setErrorMessage } from '../actions';

const ErrorSnack = ({ errorMsg, handleClose }) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    open={errorMsg !== ''}
    // autoHideDuration={6000}
    onClose={handleClose}
    SnackbarContentProps={{
      'aria-describedby': 'message-id'
    }}
    message={<span id="message-id">{errorMsg}</span>}
    action={[
      <Button key="undo" color="secondary" dense onClick={handleClose}>
        Close
      </Button>
    ]}
  />
);

ErrorSnack.propTypes = {
  errorMsg: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired
};

// ------ static styles ------

// const staticStyles = {
//   overlay: {}
// };

// ------ redux container ------

const errorSelector = (state) => state.errorMsg;

const stateSelector = createSelector(
  errorSelector,
  (errorMsg) => ({
    errorMsg
  })
);

const mapStateToProps = (state) => (
  stateSelector(state)
);

const mapDispatchToProps = (dispatch) => ({
  handleClose: () => {
    dispatch(setErrorMessage(''));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)((ErrorSnack));
