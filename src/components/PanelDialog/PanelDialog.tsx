import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Dialog, DialogActions } from '@mui/material';
import { useDisplayInfo, useDisplayMetas } from '../../slices/displayInfoAPI';
import { useMetaData } from '../../slices/metaDataAPI';
import PanelTable from '../PanelTable/PanelTable';
import styles from './PanelDialog.module.scss';
import { PanelGraphic } from '../Panel';
import { selectBasePath } from '../../selectors/app';
import { panelSrcGetter } from '../../utils';

interface PanelDialogProps {
  open: boolean;
  panel: IPanelMeta;
  source: string;
  onClose: () => void;
}

const PanelDialog: React.FC<PanelDialogProps> = ({ open, panel, source, onClose }) => {
  const metaData = useMetaData();
  const basePath = useSelector(selectBasePath);
  const foundMetaData = metaData?.currentData?.find((meta) => meta[panel?.label] === source);
  const { data: displayInfo } = useDisplayInfo();
  const labels = useDisplayMetas();

  return (
    <Dialog className={styles.panelDialog} classes={{ paper: styles.panelDialogInner }} open={open} onClose={onClose}>
      <div className={styles.panelDialogGraphic}>
        <PanelGraphic
          type={panel?.paneltype}
          src={panel?.paneltype === 'iframe' ? source : panelSrcGetter(basePath, source as string).toString()}
          alt={panel?.label}
          key={`${panel?.source}_${panel?.label}`}
          imageWidth={-1}
          aspectRatio={panel?.aspect}
        />
      </div>
      <div className={styles.panelDialogTableWrapper}>
        <PanelTable
          className={styles.panelDialogTable}
          data={foundMetaData || {}}
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
