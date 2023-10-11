import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useGetAllLocalViews } from '../../inputUtils';
import styles from './ExportViewsModal.module.scss';
import { useDisplayInfo } from '../../slices/displayInfoAPI';

interface ExportViewsModalProps {
  isOpen: boolean;
  handleExportToggle: () => void;
}

const ExportViewsModal: React.FC<ExportViewsModalProps> = ({ isOpen, handleExportToggle }) => {
  const [exportName, setExportName] = useState('');
  const { data: displayInfo } = useDisplayInfo();
  const allLocalViews = useGetAllLocalViews() as IView[];
  const { enqueueSnackbar } = useSnackbar();

  const handleExport = () => {
    const downloadObj = {
      display: displayInfo?.name,
      views: allLocalViews,
    };

    const jsonFile = new Blob([JSON.stringify(downloadObj) as unknown as BlobPart], { type: 'json' });
    const downloadLink = document.createElement('a');
    downloadLink.download = `${displayInfo?.name}_${exportName}_export_views_${new Date().toISOString().split('T')[0]}.json`;
    downloadLink.href = window.URL.createObjectURL(jsonFile);
    downloadLink.click();
    enqueueSnackbar(`View ${exportName} exported!`, {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      autoHideDuration: 3000,
    });
  };
  return (
    <div className={styles.exportViewsModal}>
      <Dialog open={isOpen} onClose={handleExportToggle}>
        <DialogTitle>Add a new view</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a file name and download a json file of your views for this display.</DialogContentText>
          <Box sx={{ mt: 2 }}>
            <TextField
              id="name"
              required
              autoFocus
              margin="dense"
              label="Export Name"
              fullWidth
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  e.stopPropagation();
                }
              }}
              onChange={(e) => {
                setExportName(e.target.value);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExportToggle}>Cancel</Button>
          <Button disabled={!exportName} onClick={handleExport}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportViewsModal;
