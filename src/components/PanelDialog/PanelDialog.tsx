import React from 'react';
import { Button, Dialog, DialogActions } from '@mui/material';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import { useMetaDataByPanelKey } from '../../slices/metaDataAPI';
import PanelTable from '../PanelTable/PanelTable';
import styles from './PanelDialog.module.scss';

interface PanelDialogProps {
  open: boolean;
  panelKey: string | number;
  children: React.ReactNode;
  onClose: () => void;
}

const PanelDialog: React.FC<PanelDialogProps> = ({ open, panelKey, children, onClose }) => {
  const data = useMetaDataByPanelKey(panelKey) || {};
  const { data: displayInfo } = useDisplayInfo();
  const labels = useDisplayMetas();

  return (
    <Dialog className={styles.panelDialog} classes={{ paper: styles.panelDialogInner }} open={open} onClose={onClose}>
      <div className={styles.panelDialogGraphic}>{children}</div>
      <div className={styles.panelDialogTableWrapper}>
        <PanelTable
          className={styles.panelDialogTable}
          data={data}
          inputs={displayInfo?.inputs?.inputs || []}
          labels={labels}
        />
      </div>
      <DialogActions>
        <Button aria-label="display info close" color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PanelDialog;
