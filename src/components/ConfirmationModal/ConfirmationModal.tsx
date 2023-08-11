import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';
import styles from './ConfirmationModal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
  dialogText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, handleCancel, handleConfirm, dialogText }) => (
  <div className={styles.confirmationModal}>
    <Dialog data-testid="confirmation-modal" open={isOpen} sx={{ zIndex: '8002' }}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="confirmation-modal-cancel" onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button data-testid="confirmation-modal-confirm" onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default ConfirmationModal;
